"use client";
import { useState } from "react";

export default function ContactForm() {
  const [ok, setOk] = useState(false);

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: appeler une route API /api/contact (à créer) si tu veux envoyer des emails
    setOk(true);
  }

  return (
    <form onSubmit={send} className="space-y-3">
      <input required name="email" type="email" placeholder="Votre e-mail" className="w-full rounded-lg border p-3" />
      <textarea required name="message" placeholder="Votre message…" className="w-full rounded-lg border p-3 h-36"></textarea>
      <button className="rounded-full px-5 py-3 text-white bg-gradient-to-r from-[#c471ed] to-[#f64f59]">
        Envoyer
      </button>
      {ok && <p className="text-sm text-green-600 mt-2">Merci ! Nous revenons vers vous rapidement.</p>}
    </form>
  );
}