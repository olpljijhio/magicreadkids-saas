"use client";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem("mk_cookies_v1");
    if (!v) setOpen(true);
  }, []);

  function acceptAll() {
    localStorage.setItem("mk_cookies_v1", JSON.stringify({ essential:true, analytics:true, date:Date.now() }));
    setOpen(false);
    // TODO: Charger analytics ici si tu en utilises (ex: Plausible/GA) seulement après consentement
  }
  function essentialOnly() {
    localStorage.setItem("mk_cookies_v1", JSON.stringify({ essential:true, analytics:false, date:Date.now() }));
    setOpen(false);
  }

  if (!open) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 z-50 max-w-3xl rounded-2xl bg-white shadow-lg ring-1 ring-black/10 p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <p className="text-sm text-gray-700">
          Nous utilisons des cookies essentiels pour faire fonctionner le site, et des cookies analytiques (optionnels) pour améliorer votre expérience. Vous pouvez refuser les cookies non essentiels.
        </p>
        <div className="flex gap-2 ml-auto shrink-0">
          <button onClick={essentialOnly} className="px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm">Essentiels uniquement</button>
          <button onClick={acceptAll} className="px-3 py-2 rounded-full text-white bg-gradient-to-r from-[#c471ed] to-[#f64f59] text-sm">Tout accepter</button>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        En savoir plus : <a href="/cookies" className="underline">Politique Cookies</a> • <a href="/confidentialite" className="underline">Confidentialité</a>
      </div>
    </div>
  );
}