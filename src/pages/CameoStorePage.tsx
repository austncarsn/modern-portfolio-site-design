interface CameoStorePageProps {
  initialView?: "shop" | "case-study";
}

export function CameoStorePage({ initialView = "shop" }: CameoStorePageProps) {
  const storeUrl = new URL(`${import.meta.env.BASE_URL}cameo-store/index.html`, window.location.origin);
  storeUrl.searchParams.set("view", initialView);
  const storeSrc = storeUrl.toString();

  return (
    <section
      aria-label="Cameo Store"
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "#FFFEF9",
        border: "1px solid var(--border-1)",
      }}
    >
      <iframe
        title="Austin Carson Cameo Store"
        src={storeSrc}
        style={{
          display: "block",
          width: "100%",
          height: "100vh",
          border: "0",
          background: "#FFFEF9",
        }}
      />
    </section>
  );
}
