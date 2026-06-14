# Deploy (Coolify + VPS)

Build via **Dockerfile** (multi-stage, Alpine, Next.js `output: standalone`).
Veja [`/Dockerfile`](../Dockerfile).

> Última atualização: 2026-06-14, durante o deploy do site-diana.

## Arquitetura do servidor (leia antes de mexer em qualquer proxy)

- **Coolify v4.1.2** roda em `:8000` (mapeado de 8080), gerencia build/deploy via Dockerfile.
- O **proxy de produção real é um Caddy próprio**, em `/home/ivan/infra/proxy/`
  (container `caddy`, rede docker `web`), que ocupa as portas **80/443** do host.
- Por isso o "Coolify Proxy" (Traefik) **fica como "Exited"** — é esperado.
  **NÃO clique em "Start Proxy"** na aba Servers > Proxy do Coolify: ele vai
  tentar bindar 80/443 e falhar ("port is already allocated"), e pode bagunçar
  o estado.
- Containers criados pelo Coolify ficam na rede docker **`coolify`** (10.0.1.x).
  O Caddy próprio está na rede **`web`** (172.18.x). Redes diferentes →
  não se enxergam por nome de container por padrão.
- O Caddy próprio já serve em produção (não derrubar sem necessidade):
  - `produtivagrafica.com.br` / `www.produtivagrafica.com.br` → `catalogo-nginx:80`
  - `api.ivanreis.com.br` → `neuron-api:3000`
  - `n8n.ivanreis.com.br` → `n8n:5678`
  - Certs em `/home/ivan/infra/proxy/certs/` (Cloudflare Origin Certificates,
    sem SAN específico — funcionam pq o Cloudflare está em modo "Full", não
    "Full strict").

---

## ⚠️ Domínio do Coolify (`*.sslip.io`) não funciona sozinho

O domínio gerado pelo Coolify (`sslip.io`) não é roteado pelo Caddy próprio, e
o HTTPS automático do Caddy (que redireciona HTTP→HTTPS pra qualquer host por
padrão) quebra esse domínio com `tlsv1 alert internal error` (sem certificado
pra ele). Além disso, Let's Encrypt tem rate limit pesado em domínios
`sslip.io` compartilhados — evite usar HTTPS com eles.

---

## Opção 1 — Teste rápido (sem domínio, sem HTTPS)

Útil para validar que o app sobe corretamente antes de configurar domínio.

1. No Coolify: app > **Configuration > General > "Port Mappings"**
2. Preencher: `0.0.0.0:PORTA_LIVRE:3000` (porta do container é 3000)
   - **IMPORTANTE**: sempre prefixar com `0.0.0.0:`. Sem isso, o Coolify expõe
     só em `127.0.0.1`, e não dá pra acessar de fora da VPS.
3. **Save** → **Redeploy**
4. Acessar via `http://178.104.101.171:PORTA_LIVRE`

### Checar portas livres antes de escolher

```bash
ssh ivan@2a01:4f8:c2c:aac0::1 'ss -tlnp'
```

Portas conhecidas já em uso (atualizar conforme novos deploys):

| Porta | Usado por |
|---|---|
| 80, 443 | Caddy (proxy de produção) |
| 8000 | Coolify |
| 6001-6002 | coolify-realtime |
| 5432 | postgres de outro projeto |
| 127.0.0.1:3000 | neuron-api |
| 3001 | site-diana (uso atual, temporário) |

---

## Opção 2 — Produção com domínio + HTTPS (via Caddy próprio)

1. Apontar DNS do (sub)domínio (ex: `diana.ivanreis.com.br`) pra `178.104.101.171`,
   de preferência via Cloudflare (modo Full), igual aos outros sites.
2. Conectar o container do Caddy na rede `coolify` (uma vez só, persiste):
   ```bash
   docker network connect coolify caddy
   ```
3. No Coolify, no app: **Configuration > General > "Network Aliases"** — definir
   um alias fixo (ex: `site-diana-app`), pois o nome do container muda a cada
   deploy (hash novo). Usar esse alias no Caddyfile.
4. Editar `/home/ivan/infra/proxy/Caddyfile`, adicionar bloco novo:
   ```
   diana.ivanreis.com.br {
       encode zstd gzip
       tls /etc/caddy/certs/ivanreis.crt /etc/caddy/certs/ivanreis.key

       reverse_proxy site-diana-app:3000 {
           header_up X-Real-IP {remote_host}
           header_up X-Forwarded-For {remote_host}
           header_up X-Forwarded-Proto {scheme}
           header_up X-Forwarded-Host {host}
       }

       log {
           output stdout
           format console
           level INFO
       }
   }
   ```
5. Validar e recarregar sem downtime:
   ```bash
   docker exec caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
   docker exec caddy caddy reload   --config /etc/caddy/Caddyfile --adapter caddyfile
   ```

---

## Variáveis de ambiente

Ver [`.env.example`](../.env.example). Em produção, usar um banco separado do
de desenvolvimento.

---

## Comandos úteis (VPS)

```bash
ssh ivan@2a01:4f8:c2c:aac0::1

docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
docker logs caddy --tail 100
docker logs <nome-do-container-do-app> --tail 100
```
