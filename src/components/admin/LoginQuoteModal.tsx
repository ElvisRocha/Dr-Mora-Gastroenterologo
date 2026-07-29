import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { Frase } from "@/lib/data/frases";

const KEY = "gastrokids:loginQuote";

export type PendingQuote = { frase: Frase; saludo: string };

export function stashLoginQuote(q: PendingQuote) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(q));
  } catch {
    /* noop */
  }
}

function readAndClear(): PendingQuote | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    return JSON.parse(raw) as PendingQuote;
  } catch {
    return null;
  }
}

export function LoginQuoteModal() {
  const [pending, setPending] = useState<PendingQuote | null>(null);

  useEffect(() => {
    setPending(readAndClear());
  }, []);

  if (!pending) return null;

  return (
    <Modal
      open
      onClose={() => setPending(null)}
      title={pending.saludo}
      size="md"
    >
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          Una frase para acompañar tu día:
        </p>
        <blockquote className="relative rounded-2xl border-l-4 border-leaf bg-leaf/8 px-5 py-4">
          <Quote size={22} className="absolute -left-0 -top-0 text-leaf/30" />
          <p className="font-display text-lg leading-relaxed text-foreground">
            {pending.frase.texto}
          </p>
          <footer className="mt-2 text-sm font-medium text-muted-foreground">
            — {pending.frase.autor}
          </footer>
        </blockquote>
        <div className="flex justify-end">
          <Button onClick={() => setPending(null)}>Comenzar el día</Button>
        </div>
      </div>
    </Modal>
  );
}
