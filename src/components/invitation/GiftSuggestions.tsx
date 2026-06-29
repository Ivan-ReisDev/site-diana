"use client";

import { Lightbulb, Sparkles } from "lucide-react";

export type GiftItem = {
  id: number;
  nome: string;
  imagem: string;
};

export type GiftSuggestion = {
  giftId: number;
  ideias: string[];
};

export const giftItems: GiftItem[] = [
  {
    id: 1,
    nome: "Brinquedos interativos",
    imagem:
      "https://images.pexels.com/photos/35579565/pexels-photo-35579565.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 2,
    nome: "Bichinhos de pelúcia",
    imagem:
      "https://images.pexels.com/photos/113559/pexels-photo-113559.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 3,
    nome: "Livrinhos infantis",
    imagem:
      "https://images.pexels.com/photos/4887203/pexels-photo-4887203.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 4,
    nome: "Brinquedos musicais",
    imagem:
      "https://images.pexels.com/photos/9644670/pexels-photo-9644670.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 5,
    nome: "Brinquedos educativos",
    imagem:
      "https://images.pexels.com/photos/6255656/pexels-photo-6255656.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 6,
    nome: "Roupinhas e Vestidinhos",
    imagem:
      "https://images.pexels.com/photos/3875080/pexels-photo-3875080.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 7,
    nome: "Brinquedos sensoriais",
    imagem:
      "https://images.pexels.com/photos/4487869/pexels-photo-4487869.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 8,
    nome: "Sapatinhos e Sandálias",
    imagem:
      "https://images.pexels.com/photos/19471464/pexels-photo-19471464.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 9,
    nome: "Brinquedos de encaixe ou montar",
    imagem:
      "https://images.pexels.com/photos/4491703/pexels-photo-4491703.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 10,
    nome: "Brinquedos de puxar ou empurrar",
    imagem:
      "https://images.pexels.com/photos/6132059/pexels-photo-6132059.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    id: 11,
    nome: "Instrumentos musicais infantis",
    imagem:
      "https://images.pexels.com/photos/6743155/pexels-photo-6743155.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

export const giftSuggestions: GiftSuggestion[] = [
  {
    giftId: 1,
    ideias: [
      "Painel ou cubo de atividades com botões, luzes e sons",
      "Mesa interativa para brincar em pé",
      "Brinquedo de causa e efeito (apertar, girar, encaixar)",
    ],
  },
  {
    giftId: 2,
    ideias: [
      "Pelúcia macia (≥ 30cm) sem peças pequenas",
      "Bichinho de conforto para a hora de dormir",
      "Pelúcia com chocalho ou som suave",
    ],
  },
  {
    giftId: 3,
    ideias: [
      "Livro cartonado com texturas e cores",
      "Livro de banho à prova d'água",
      "Livro sonoro com músicas e rimas",
    ],
  },
  {
    giftId: 4,
    ideias: [
      "Tamborzinho ou bateria infantil",
      "Brinquedo musical com luzes e melodias",
      "Chocalho ou maraca colorido para os primeiros sons",
    ],
  },
  {
    giftId: 5,
    ideias: [
      "Quebra-cabeça de madeira com peças grandes",
      "Jogo de encaixe de formas e cores",
      "Brinquedo de números, letras e contagem",
    ],
  },
  {
    giftId: 6,
    ideias: [
      "Vestidinho para 1–2 anos (tema princesa)",
      "Conjuntinho confortável de algodão",
      "Body ou macacão fofinho",
    ],
  },
  {
    giftId: 7,
    ideias: [
      "Massinha de modelar atóxica",
      "Brinquedo com texturas e mordedor",
      "Bolas e blocos sensoriais coloridos",
    ],
  },
  {
    giftId: 8,
    ideias: [
      "Sapatinho macio para os primeiros passos",
      "Sandália confortável (tam. 18–22)",
      "Tênis flexível antiderrapante",
    ],
  },
  {
    giftId: 9,
    ideias: [
      "Blocos de montar grandes (sem engasgo)",
      "Cubos de empilhar coloridos",
      "Torre de encaixe progressivo",
    ],
  },
  {
    giftId: 10,
    ideias: [
      "Carrinho ou animal de puxar com cordinha",
      "Andador empurrador com som e luz",
      "Bichinho com rodinhas para empurrar",
    ],
  },
  {
    giftId: 11,
    ideias: [
      "Xilofone colorido infantil",
      "Pianinho ou teclado de brinquedo",
      "Kit de percussão (pandeiro, chocalho)",
    ],
  },
];

export function GiftSuggestions() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-12 text-center">
        <h2 className="mb-3 font-script text-6xl leading-[1.1] text-[#b85f78] sm:text-7xl">
          Sugestões de Presente
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-[#7e5f5b]">
          Ideias carinhosas para a princesa Diana, cada presente é apenas uma
          inspiração para quem quiser presentear com carinho.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {giftSuggestions.map((sug) => {
          const item = giftItems.find((g) => g.id === sug.giftId);
          return (
            <article
              key={sug.giftId}
              className="flex flex-col overflow-hidden rounded-[1.75rem] bg-white/82 shadow-[0_6px_18px_rgba(201,111,135,.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(201,111,135,.12)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#fff5f8]">
                {item?.imagem ? (
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl text-[#df7894]">
                    <Sparkles className="h-12 w-12" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                )}
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-[#b85f78] shadow-sm">
                  <Lightbulb className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
                  Sugestão
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="font-serif text-2xl font-black leading-tight text-[#b85f78]">
                  {item?.nome ?? "Presente"}
                </h3>

                <ul className="mt-4 space-y-2">
                  {sug.ideias.map((ideia, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm leading-6 text-[#806966] sm:text-base"
                    >
                      <span className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#df7894]" />
                      {ideia}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
