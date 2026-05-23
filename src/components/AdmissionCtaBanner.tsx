import Link from "next/link";
import { siteConfig } from "../../site.config";

type Props = {
  title: string;
  body: string;
  button: string;
};

export default function AdmissionCtaBanner({ title, body, button }: Props) {
  return (
    <section className="border-y border-[#EEA748]/30 bg-gradient-to-b from-[#FFF8EE] to-[#FAFBFF] py-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center sm:flex-row sm:text-start">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#0E2250] sm:text-2xl">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#64748B] sm:text-base">{body}</p>
        </div>
        <Link
          href={siteConfig.paths.admissionForm}
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#1D4395] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#2857B8]"
        >
          {button}
        </Link>
      </div>
    </section>
  );
}
