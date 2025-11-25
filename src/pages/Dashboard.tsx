import { useMemo, type ReactNode } from "react";
import {
  BarChart3,
  BookOpen,
  Boxes,
  Layers,
  Languages,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge, Card, Spinner } from "../components/atoms";
import { useStore } from "../contexts/StoreContext";
import type { BookStatus } from "../types";

type StatTone = "primary" | "success" | "warning" | "neutral";

interface StatCardProps {
  title: string;
  value: string;
  helper?: string;
  icon: ReactNode;
  tone?: StatTone;
}

const toneStyles: Record<StatTone, { bg: string; icon: string }> = {
  primary: {
    bg: "bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border-primary/20",
    icon: "text-primary",
  },
  success: {
    bg: "bg-gradient-to-br from-success/15 via-success/5 to-transparent border-success/25",
    icon: "text-success",
  },
  warning: {
    bg: "bg-gradient-to-br from-warning/15 via-warning/5 to-transparent border-warning/25",
    icon: "text-warning",
  },
  neutral: {
    bg: "bg-gradient-to-br from-muted/60 via-card to-transparent border-border",
    icon: "text-foreground",
  },
};

const StatCard = ({
  title,
  value,
  helper,
  icon,
  tone = "neutral",
}: StatCardProps) => {
  const toneClass = toneStyles[tone];

  return (
    <Card
      className={`relative overflow-hidden border ${toneClass.bg} backdrop-blur-sm`}
      padding="lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          {helper && (
            <p className="text-xs text-muted-foreground mt-2">{helper}</p>
          )}
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full bg-card/90 shadow-inner ${toneClass.icon}`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

type StatusCounts = Record<BookStatus, number> & { sinStock: number };

const statusList: Array<{ key: BookStatus; label: string; color: string }> = [
  { key: "disponible", label: "Disponibles", color: "bg-primary" },
  { key: "agotado", label: "Agotados", color: "bg-error" },
  { key: "proximamente", label: "Próximamente", color: "bg-warning" },
  { key: "descatalogado", label: "Descatalogados", color: "bg-secondary" },
];

const Dashboard = () => {
  const { books, categories, authors, isLoading } = useStore();

  const totalBooks = books.length;
  const totalCategories = categories.length;
  const totalAuthors = authors.length;

  const totalStock = useMemo(
    () => books.reduce((sum, book) => sum + (Number(book.stock) || 0), 0),
    [books]
  );

  const inventoryValue = useMemo(
    () =>
      books.reduce(
        (sum, book) =>
          sum + (Number(book.price) || 0) * (Number(book.stock) || 0),
        0
      ),
    [books]
  );

  const averagePrice = useMemo(() => {
    if (!totalBooks) return 0;
    const totalPrice = books.reduce(
      (sum, book) => sum + (Number(book.price) || 0),
      0
    );
    return totalPrice / totalBooks;
  }, [books, totalBooks]);

  const statusCounts = useMemo<StatusCounts>(() => {
    const baseCounts: Record<BookStatus, number> = {
      disponible: 0,
      agotado: 0,
      proximamente: 0,
      descatalogado: 0,
    };

    let sinStock = 0;

    books.forEach((book) => {
      const status = (book.status || "disponible") as BookStatus;
      baseCounts[status] = (baseCounts[status] || 0) + 1;
      if ((book.stock ?? 0) <= 0) {
        sinStock += 1;
      }
    });

    return { ...baseCounts, sinStock };
  }, [books]);

  const categoryBreakdown = useMemo(() => {
    const counts: Record<number, { books: number; stock: number }> = {};

    books.forEach((book) => {
      const catId = book.categoryId;
      if (!counts[catId]) {
        counts[catId] = { books: 0, stock: 0 };
      }
      counts[catId].books += 1;
      counts[catId].stock += Number(book.stock) || 0;
    });

    const enhanced = categories.map((category) => ({
      categoryId: category.categoryId,
      name: category.name,
      books: counts[category.categoryId]?.books || 0,
      stock: counts[category.categoryId]?.stock || 0,
    }));

    const categoriesWithBooks = enhanced.filter((cat) => cat.books > 0).length;

    return {
      categoriesWithBooks,
      categoriesWithoutBooks: Math.max(
        totalCategories - categoriesWithBooks,
        0
      ),
      topCategories: [...enhanced]
        .sort((a, b) => b.books - a.books)
        .slice(0, 5),
    };
  }, [books, categories, totalCategories]);

  const topAuthors = useMemo(
    () =>
      Object.entries(
        books.reduce<Record<number, number>>((acc, book) => {
          const id = Number(book.authorId || book.autor_id);
          if (!id) return acc;
          acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {})
      )
        .map(([id, count]) => {
          const author = authors.find(
            (a) => a.authorId === Number(id) || a.autor_id === Number(id)
          );
          return {
            id: Number(id),
            name: author?.name || author?.nombre || "Autor desconocido",
            count,
          };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
    [authors, books]
  );

  const languageStats = useMemo(
    () =>
      Object.entries(
        books.reduce<Record<string, number>>((acc, book) => {
          const language = (book.language || "Sin idioma").trim();
          acc[language] = (acc[language] || 0) + 1;
          return acc;
        }, {})
      )
        .map(([language, count]) => ({ language, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
    [books]
  );

  const formatNumber = (value: number) =>
    value.toLocaleString("es-ES", { maximumFractionDigits: 0 });

  const formatCurrency = (value: number) =>
    `Bs. ${value.toLocaleString("es-BO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatPercent = (value: number, total: number) => {
    if (!total) return "0%";
    return `${Math.round((value / total) * 100)}%`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Panel administrativo
          </p>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Resumen con las métricas principales de libros, categorías y autores
            cargados en la plataforma.
          </p>
        </div>
        {isLoading && (
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-sm text-muted-foreground">
            <Spinner size="sm" />
            <span>Sincronizando datos...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Libros"
          value={formatNumber(totalBooks)}
          helper={`${formatNumber(statusCounts.disponible)} disponibles`}
          icon={<BookOpen className="h-5 w-5" />}
          tone="primary"
        />
        <StatCard
          title="Categorías"
          value={formatNumber(totalCategories)}
          helper={`${formatNumber(
            categoryBreakdown.categoriesWithBooks
          )} con libros`}
          icon={<Layers className="h-5 w-5" />}
        />
        <StatCard
          title="Autores"
          value={formatNumber(totalAuthors)}
          helper={`${formatNumber(
            topAuthors.reduce((sum, author) => sum + author.count, 0)
          )} libros registrados`}
          icon={<Users className="h-5 w-5" />}
          tone="success"
        />
        <StatCard
          title="Stock total"
          value={formatNumber(totalStock)}
          helper={formatCurrency(inventoryValue)}
          icon={<Boxes className="h-5 w-5" />}
          tone="warning"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Resumen de inventario
              </h2>
              <p className="text-sm text-muted-foreground">
                Valores calculados a partir de los libros registrados.
              </p>
            </div>
            <Badge variant="secondary" size="sm">
              Catálogo
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Valor inventario</p>
              <p className="text-xl font-semibold text-foreground">
                {formatCurrency(inventoryValue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Precio promedio</p>
              <p className="text-xl font-semibold text-foreground">
                {formatCurrency(averagePrice)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stock por libro</p>
              <p className="text-xl font-semibold text-foreground">
                {formatNumber(totalBooks ? Math.round(totalStock / totalBooks) : 0)}{" "}
                unidades
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sin stock</p>
              <p className="text-xl font-semibold text-warning">
                {formatNumber(statusCounts.sinStock)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Estado del catálogo
              </h2>
              <p className="text-sm text-muted-foreground">
                Libros agrupados por estado de publicación.
              </p>
            </div>
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>

          <div className="space-y-3">
            {statusList.map(({ key, label, color }) => {
              const count = statusCounts[key];
              const percentage = totalBooks
                ? Math.round((count / totalBooks) * 100)
                : 0;
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium text-foreground">
                    <span>{label}</span>
                    <span className="text-muted-foreground">
                      {formatNumber(count)} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full ${color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Idiomas principales
              </h2>
              <p className="text-sm text-muted-foreground">
                Distribución por idioma de los títulos registrados.
              </p>
            </div>
            <Languages className="h-5 w-5 text-primary" />
          </div>

          <div className="space-y-3">
            {languageStats.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aún no hay libros cargados para mostrar idiomas.
              </p>
            ) : (
              languageStats.map((item) => (
                <div
                  key={item.language}
                  className="flex items-center justify-between rounded-lg bg-muted px-3 py-2"
                >
                  <span className="text-sm font-medium text-foreground">
                    {item.language}
                  </span>
                  <Badge variant="primary" size="sm">
                    {formatPercent(item.count, totalBooks)}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Categorías con más libros
              </h2>
              <p className="text-sm text-muted-foreground">
                {formatNumber(categoryBreakdown.categoriesWithBooks)} de{" "}
                {formatNumber(totalCategories)} categorías tienen libros
                asignados.
              </p>
            </div>
            <Badge variant="secondary" size="sm">
              Catálogo
            </Badge>
          </div>

          {categoryBreakdown.topCategories.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay libros asociados a categorías.
            </p>
          ) : (
            <div className="space-y-4">
              {categoryBreakdown.topCategories.map((cat) => {
                const share = totalBooks
                  ? Math.round((cat.books / totalBooks) * 100)
                  : 0;
                return (
                  <div key={cat.categoryId} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium text-foreground">
                      <span className="truncate">{cat.name}</span>
                      <span className="text-muted-foreground">
                        {formatNumber(cat.books)} libros
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(cat.stock)} unidades en esta categoría
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {categoryBreakdown.categoriesWithoutBooks > 0 && (
            <div className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning-foreground">
              {formatNumber(categoryBreakdown.categoriesWithoutBooks)} categoría(s)
              aún no tienen libros asignados.
            </div>
          )}
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Autores más activos
              </h2>
              <p className="text-sm text-muted-foreground">
                Autores con más títulos dentro del catálogo.
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>

          {topAuthors.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Todavía no hay autores con libros registrados.
            </p>
          ) : (
            <div className="space-y-3">
              {topAuthors.map((author) => (
                <div
                  key={author.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {author.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Registros en catálogo
                    </p>
                  </div>
                  <Badge variant="primary" size="md">
                    {formatNumber(author.count)} libros
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
