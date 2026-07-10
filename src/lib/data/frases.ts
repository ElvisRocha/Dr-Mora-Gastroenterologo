// Frases inspiradoras para el saludo posterior al login del panel clínico.
// Temática: infancia, medicina y cuidado. Neutrales.

export type Frase = { texto: string; autor: string };

export const frases: Frase[] = [
  {
    texto:
      "El arte de la medicina consiste en entretener al paciente mientras la naturaleza cura la enfermedad.",
    autor: "Voltaire",
  },
  {
    texto:
      "Los niños son el recurso más importante del mundo y la mejor esperanza para el futuro.",
    autor: "John F. Kennedy",
  },
  {
    texto: "Curar a veces, aliviar con frecuencia, consolar siempre.",
    autor: "Aforismo médico",
  },
  {
    texto:
      "No hay revelación más nítida del alma de una sociedad que la forma en que trata a sus niños.",
    autor: "Nelson Mandela",
  },
  {
    texto:
      "La mejor manera de hacer buenos niños es hacerlos felices.",
    autor: "Oscar Wilde",
  },
  {
    texto:
      "Donde hay amor por la medicina, hay también amor por la humanidad.",
    autor: "Hipócrates",
  },
  {
    texto:
      "La salud no lo es todo, pero sin ella, todo lo demás es nada.",
    autor: "Arthur Schopenhauer",
  },
  {
    texto:
      "Escuchar al paciente: te está diciendo el diagnóstico.",
    autor: "William Osler",
  },
];

let ultima = -1;

export function fraseDelDia(): Frase {
  // Evita repetir la inmediata anterior en la misma sesión.
  let i = Math.floor(Math.random() * frases.length);
  if (i === ultima) i = (i + 1) % frases.length;
  ultima = i;
  return frases[i];
}
