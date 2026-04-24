import { useNavigate } from "react-router-dom";

import Button from "../shared/components/common/Button";

export default function ErrorStatePage({
  code,
  title,
  description,
  primaryLabel,
  primaryTo,
  onPrimaryClick,
  secondaryLabel,
  secondaryTo,
  onSecondaryClick,
}) {
  const navigate = useNavigate();

  const handleAction = (to, onClick) => {
    if (onClick) {
      onClick();
      return;
    }

    if (to) {
      navigate(to);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-container-lowest px-6 py-12 text-center">
      <section className="w-full max-w-xl rounded-2xl border border-outline-variant bg-surface px-6 py-10 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:px-10 sm:py-12">
        <span className="inline-flex rounded-full border border-primary/20 bg-primary-soft px-5 py-2 text-5xl font-black leading-none text-primary-hover sm:text-6xl">
          {code}
        </span>

        <h1 className="mt-6 font-headline text-2xl font-bold text-on-surface sm:text-3xl">
          {title}
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-on-surface-variant sm:text-base">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {primaryLabel ? (
            <Button
              type="button"
              variant="primary"
              className="min-w-36 px-5 py-3"
              onClick={() => handleAction(primaryTo, onPrimaryClick)}
            >
              {primaryLabel}
            </Button>
          ) : null}

          {secondaryLabel ? (
            <Button
              type="button"
              variant="white"
              className="min-w-36 px-5 py-3"
              onClick={() => handleAction(secondaryTo, onSecondaryClick)}
            >
              {secondaryLabel}
            </Button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
