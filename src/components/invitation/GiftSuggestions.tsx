"use client";

import { motion, type Variants } from "framer-motion";
import { Sparkles } from "lucide-react";

const giftReveal: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const giftItemReveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

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
    nome: "Brinquedo de empurrar",
    imagem: "/galeria/brinquedos/brinquedos.jpeg",
  },
  {
    id: 2,
    nome: "Bichinhos de pelúcia",
    imagem: "/galeria/brinquedos/ursinho.jpeg",
  },
  {
    id: 3,
    nome: "Livrinhos infantis",
    imagem: "/galeria/brinquedos/livros.jpeg",
  },
  {
    id: 4,
    nome: "Brinquedos musicais",
    imagem: "/galeria/brinquedos/instrumentos-musicais.jpeg",
  },
  {
    id: 5,
    nome: "Brinquedos educativos",
    imagem: "/galeria/brinquedos/brinquedos-educativos.jpeg",
  },
  {
    id: 6,
    nome: "Roupinhas e Vestidinhos",
    imagem: "/galeria/brinquedos/vestidinhos-roupas.jpeg",
  },
  {
    id: 7,
    nome: "Brinquedos sensoriais",
    imagem: "/galeria/brinquedos/brinquedos-sensoriais.jpeg",
  },
  {
    id: 8,
    nome: "Sapatinhos e Sandálias",
    imagem: "/galeria/brinquedos/sapatinhos.jpeg",
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
      "Um bichinho de pelúcia bem macio e fofinho",
      "Companhia perfeita para a hora de dormir",
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
      "Vestidinho para 1–2 anos ou 18 a 24 meses",
      "Conjuntinho confortável de algodão",
      "Body ou macacão fofinho",
    ],
  },
  {
    giftId: 7,
    ideias: [
      "Massinha de modelar segura para bebês",
      "Brinquedo com texturas e mordedor",
      "Bolas e blocos sensoriais coloridos",
    ],
  },
  {
    giftId: 8,
    ideias: [
      "Sapatinho macio para os primeiros passos",
      "Sandália confortável (tamanho 18 ao 22)",
      "Tênis flexível antiderrapante",
    ],
  },
];

export function GiftSuggestions() {
  return (
    <motion.div
      className="mx-auto max-w-6xl"
      variants={giftReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div className="mb-12 text-center" variants={giftItemReveal}>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[.3em] text-[#d36f8a]">
          Lista de Presentes
        </p>
        <h2 className="mb-3 font-script text-6xl leading-[1.1] text-[#b85f78] sm:text-7xl">
          Sugestões de Presente
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-8 text-[#7e5f5b] sm:text-xl">
          Ideias carinhosas para a Princesa Diana, cada presente é apenas uma
          inspiração para quem quiser presentear com carinho.
        </p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {giftSuggestions.map((sug) => {
          const item = giftItems.find((g) => g.id === sug.giftId);
          return (
            <motion.article
              key={sug.giftId}
              variants={giftItemReveal}
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
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="font-script text-3xl leading-tight text-[#b85f78]">
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
            </motion.article>
          );
        })}
      </div>
    </motion.div>
  );
}
