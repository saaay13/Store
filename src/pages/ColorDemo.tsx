/**
 * Página de demostración del sistema de colores
 * Muestra todas las paletas y variables semánticas con soporte para dark mode
 */

const ColorDemo = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="border-b border-border pb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Sistema de Colores
          </h1>
          <p className="text-muted-foreground">
            Paleta completa con soporte automático para modo oscuro
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            💡 Cambia tu sistema operativo a modo oscuro para ver la
            transformación automática
          </p>
        </header>

        {/* Variables Semánticas */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Variables Semánticas</h2>
          <p className="text-muted-foreground mb-6">
            Estas variables cambian automáticamente entre modo claro y oscuro
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Primary */}
            <div className="space-y-2">
              <div className="bg-primary text-primary-foreground p-6 rounded-lg">
                <p className="font-semibold">Primary</p>
                <p className="text-sm opacity-90">Color de marca principal</p>
              </div>
            </div>

            {/* Background */}
            <div className="space-y-2">
              <div className="bg-background border-2 border-border text-foreground p-6 rounded-lg">
                <p className="font-semibold">Background</p>
                <p className="text-sm text-muted-foreground">Fondo principal</p>
              </div>
            </div>

            {/* Muted */}
            <div className="space-y-2">
              <div className="bg-muted text-muted-foreground p-6 rounded-lg">
                <p className="font-semibold">Muted</p>
                <p className="text-sm">Fondo secundario</p>
              </div>
            </div>

            {/* Accent */}
            <div className="space-y-2">
              <div className="bg-accent text-accent-foreground p-6 rounded-lg">
                <p className="font-semibold">Accent</p>
                <p className="text-sm opacity-90">Hover states</p>
              </div>
            </div>

            {/* Card */}
            <div className="space-y-2">
              <div className="bg-card text-card-foreground border border-border p-6 rounded-lg">
                <p className="font-semibold">Card</p>
                <p className="text-sm text-muted-foreground">Cards y paneles</p>
              </div>
            </div>

            {/* Border */}
            <div className="space-y-2">
              <div className="bg-background border-4 border-border text-foreground p-6 rounded-lg">
                <p className="font-semibold">Border</p>
                <p className="text-sm text-muted-foreground">
                  Bordes y divisores
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Estados */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Colores de Estado</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-success text-success-foreground p-6 rounded-lg">
              <p className="font-semibold">Success</p>
              <p className="text-sm opacity-90">Operación exitosa</p>
            </div>

            <div className="bg-error text-error-foreground p-6 rounded-lg">
              <p className="font-semibold">Error</p>
              <p className="text-sm opacity-90">Error o peligro</p>
            </div>

            <div className="bg-warning text-warning-foreground p-6 rounded-lg">
              <p className="font-semibold">Warning</p>
              <p className="text-sm opacity-90">Advertencia</p>
            </div>

            <div className="bg-info text-info-foreground p-6 rounded-lg">
              <p className="font-semibold">Info</p>
              <p className="text-sm opacity-90">Información</p>
            </div>
          </div>
        </section>

        {/* Paleta Principal */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            Paleta Primary (Principal)
          </h2>
          <p className="text-muted-foreground mb-6">
            Actualmente verde - puede cambiar a cualquier color sin modificar
            las clases
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { shade: 50, cls: "bg-primary-50" },
              { shade: 100, cls: "bg-primary-100" },
              { shade: 200, cls: "bg-primary-200" },
              { shade: 300, cls: "bg-primary-300" },
              { shade: 400, cls: "bg-primary-400" },
              { shade: 500, cls: "bg-primary-500" },
              { shade: 600, cls: "bg-primary-600" },
              { shade: 700, cls: "bg-primary-700" },
              { shade: 800, cls: "bg-primary-800" },
              { shade: 900, cls: "bg-primary-900" },
              { shade: 950, cls: "bg-primary-950" },
            ].map(({ shade, cls }) => (
              <div key={shade} className="space-y-2">
                <div
                  className={`${cls} p-4 rounded-lg ${
                    shade >= 600 ? "text-white" : "text-neutral-900"
                  }`}
                >
                  <p className="font-mono text-sm font-semibold">{shade}</p>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  primary-{shade}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Paleta Secondary */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            Paleta Secondary (Secundaria)
          </h2>
          <p className="text-muted-foreground mb-6">
            Grises/azulados para elementos secundarios
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { shade: 50, cls: "bg-secondary-50" },
              { shade: 100, cls: "bg-secondary-100" },
              { shade: 200, cls: "bg-secondary-200" },
              { shade: 300, cls: "bg-secondary-300" },
              { shade: 400, cls: "bg-secondary-400" },
              { shade: 500, cls: "bg-secondary-500" },
              { shade: 600, cls: "bg-secondary-600" },
              { shade: 700, cls: "bg-secondary-700" },
              { shade: 800, cls: "bg-secondary-800" },
              { shade: 900, cls: "bg-secondary-900" },
              { shade: 950, cls: "bg-secondary-950" },
            ].map(({ shade, cls }) => (
              <div key={shade} className="space-y-2">
                <div
                  className={`${cls} p-4 rounded-lg ${
                    shade >= 500 ? "text-white" : "text-neutral-900"
                  }`}
                >
                  <p className="font-mono text-sm font-semibold">{shade}</p>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  secondary-{shade}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Paleta de Neutros */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Paleta Neutral (Grises)</h2>
          <p className="text-muted-foreground mb-6">
            Para texto, fondos y elementos de UI
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { shade: 50, cls: "bg-neutral-50" },
              { shade: 100, cls: "bg-neutral-100" },
              { shade: 200, cls: "bg-neutral-200" },
              { shade: 300, cls: "bg-neutral-300" },
              { shade: 400, cls: "bg-neutral-400" },
              { shade: 500, cls: "bg-neutral-500" },
              { shade: 600, cls: "bg-neutral-600" },
              { shade: 700, cls: "bg-neutral-700" },
              { shade: 800, cls: "bg-neutral-800" },
              { shade: 900, cls: "bg-neutral-900" },
              { shade: 950, cls: "bg-neutral-950" },
            ].map(({ shade, cls }) => (
              <div key={shade} className="space-y-2">
                <div
                  className={`${cls} p-4 rounded-lg ${
                    shade >= 500 ? "text-white" : "text-neutral-900"
                  }`}
                >
                  <p className="font-mono text-sm font-semibold">{shade}</p>
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  neutral-{shade}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Ejemplos de Componentes */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Ejemplos de Componentes</h2>

          <div className="space-y-8">
            {/* Botones */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Botones</h3>
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90">
                  Botón Primary
                </button>
                <button className="bg-muted text-foreground px-6 py-2 rounded-lg hover:bg-accent">
                  Botón Secondary
                </button>
                <button className="bg-error text-error-foreground px-6 py-2 rounded-lg hover:opacity-90">
                  Botón Destructivo
                </button>
                <button className="border-2 border-border bg-background text-foreground px-6 py-2 rounded-lg hover:bg-accent">
                  Botón Outline
                </button>
              </div>
            </div>

            {/* Cards */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card text-card-foreground border border-border p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">Card Simple</h4>
                  <p className="text-muted-foreground">
                    Contenido del card con texto secundario
                  </p>
                </div>

                <div className="bg-primary text-primary-foreground p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">Card Primary</h4>
                  <p className="opacity-90">
                    Card destacado con color principal
                  </p>
                </div>

                <div className="bg-muted text-foreground p-6 rounded-lg">
                  <h4 className="font-semibold mb-2">Card Muted</h4>
                  <p className="text-muted-foreground">
                    Card con fondo secundario
                  </p>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Inputs</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="ejemplo@email.com"
                    className="w-full bg-background border border-input text-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-background border border-input text-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>

            {/* Badges */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Badges</h3>
              <div className="flex flex-wrap gap-3">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Primary
                </span>
                <span className="bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Success
                </span>
                <span className="bg-error text-error-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Error
                </span>
                <span className="bg-warning text-warning-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Warning
                </span>
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Accent
                </span>
              </div>
            </div>

            {/* Alerts */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Alerts</h3>
              <div className="space-y-3">
                <div className="bg-success/10 border border-success text-success p-4 rounded-lg">
                  <strong className="font-semibold">Éxito!</strong> La operación
                  se completó correctamente.
                </div>
                <div className="bg-error/10 border border-error text-error p-4 rounded-lg">
                  <strong className="font-semibold">Error!</strong> Hubo un
                  problema al procesar la solicitud.
                </div>
                <div className="bg-warning/10 border border-warning text-warning p-4 rounded-lg">
                  <strong className="font-semibold">Advertencia!</strong> Revisa
                  los datos ingresados.
                </div>
                <div className="bg-info/10 border border-info text-info p-4 rounded-lg">
                  <strong className="font-semibold">Info:</strong> Información
                  importante sobre el sistema.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-8 text-center text-muted-foreground">
          <p>
            Sistema de colores con Tailwind CSS v4 • Soporte automático para
            Dark Mode
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ColorDemo;
