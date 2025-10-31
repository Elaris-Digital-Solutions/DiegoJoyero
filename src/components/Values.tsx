export function Values() {
  const values = [
    {
      title: 'Excelencia Artesanal',
      description:
        'Nuestros maestros artesanos trabajan cada engaste de forma manual, asegurando proporciones exactas y terminaciones pulidas a espejo.',
    },
    {
      title: 'Compromiso con la Autenticidad',
      description:
        'Certificados de autenticidad y trazabilidad acompañan cada pieza. Solo utilizamos metales nobles y gemas provenientes de fuentes responsables.',
    },
    {
      title: 'Diseño con Historia',
      description:
        'Colecciones inspiradas en los archivos de la maison, reinterpretadas con un lenguaje contemporáneo pensado para perdurar.',
    },
  ];

  return (
    <section id="values" className="py-24" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs uppercase tracking-[0.5em]" style={{ color: 'var(--textSecondary)' }}>
            Nuestros pilares
          </span>
          <h2 className="text-4xl md:text-5xl font-display" style={{ color: 'var(--text)' }}>
            Valores inquebrantables
          </h2>
        </div>

        <div className="grid gap-12 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="flex flex-col gap-4 border-t pt-8" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-2xl font-display" style={{ color: 'var(--text)' }}>
                {value.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--textSecondary)' }}>
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
