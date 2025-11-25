import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Icon, Input, Spinner, ThemeToggle } from "../components/atoms";
import { StoreLocationsMap } from "../components/molecules";
import { BookCardVariant2 } from "../components/organisms";
import { useStore } from "../contexts/StoreContext";
import type { StoreLocation } from "../types";

type CategoryCardData = {
  name: string;
  link: string;
  description?: string;
  image: string;
};

const services = [
  {
    icon: "📚",
    title: "Venta de libros originales",
    description: "Stock curado con editoriales oficiales",
  },
  {
    icon: "🇧🇴",
    title: "Envíos a todo el país",
    description: "Cobertura nacional y seguimiento",
  },
  {
    icon: "🚚",
    title: "Entregas a domicilio",
    description: "Delivery en ciudades principales",
  },
  {
    icon: "📦",
    title: "Importación a pedido",
    description: "Buscamos y traemos títulos difíciles",
  },
];

const fallbackCategories: CategoryCardData[] = [
  { name: "Clasicos", link: "/products?category=clasicos", image: "/img/libros.png" },
  { name: "Infantiles", link: "/products?category=infantiles", image: "/img/cuentos.png" },
  { name: "Juveniles", link: "/products?category=juveniles", image: "/img/libros2.png" },
  { name: "Poesia", link: "/products?category=poesia", image: "/img/libros3.png" },
  { name: "Ingles", link: "/products?category=ingles", image: "/img/cuentos.png" },
  { name: "Nacionales", link: "/products?category=nacionales", image: "/img/libros2.png" },
];

const storeLocations: StoreLocation[] = [
  {
    locationId: 1,
    name: "Librería Libros - Sucursal Principal",
    address: "Calle Colombia entre Aurelio Meleán y Julio Arauco #1069",
    city: "Cochabamba",
    phone: "+591 4 4234567",
    email: "info@libros.com.bo",
    latitude: -17.3935,
    longitude: -66.1570,
    openingHours: "Lun-Vie: 10:00-13:00 / 15:00-19:00 | Sáb: 10:00-13:00",
    description: "Nuestra sucursal principal en el centro de Cochabamba",
    isPrimary: true,
  },
  {
    locationId: 2,
    name: "Librería Libros - Zona Norte",
    address: "Av. Blanco Galindo Km 4.5",
    city: "Cochabamba",
    phone: "+591 4 4234568",
    email: "norte@libros.com.bo",
    latitude: -17.3700,
    longitude: -66.1700,
    openingHours: "Lun-Vie: 10:00-19:00 | Sáb: 10:00-14:00",
    description: "Sucursal en la zona norte con amplio estacionamiento",
    isPrimary: false,
  },
  {
    locationId: 3,
    name: "Librería Libros - Zona Sur",
    address: "Av. Libertador Simón Bolívar",
    city: "Cochabamba",
    phone: "+591 4 4234569",
    email: "sur@libros.com.bo",
    latitude: -17.4200,
    longitude: -66.1500,
    openingHours: "Lun-Vie: 10:00-19:00 | Sáb-Dom: 10:00-14:00",
    description: "Sucursal en la zona sur, abierta fines de semana",
    isPrimary: false,
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { books, categories, isLoading } = useStore();

  const featuredBooks = useMemo(() => books.slice(0, 4), [books]);

  const categoryCards: CategoryCardData[] = useMemo(() => {
    if (categories.length === 0) return fallbackCategories;

    const normalizeLink = (name: string) =>
      `/products?category=${name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")}`;

    const fallbackImages = [
      "/img/libros.png",
      "/img/cuentos.png",
      "/img/libros2.png",
      "/img/libros3.png",
    ];

    return categories.slice(0, 6).map((category, index) => ({
      name: category.name,
      description: category.description || "Explora la colección",
      link: normalizeLink(category.name),
      image: category.imageUrl || fallbackImages[index % fallbackImages.length],
    }));
  }, [categories]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
              onClick={() => navigate("/")}
            >
              <div className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold">
                L
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Librería digital</p>
                <p className="text-xl font-bold">Libros</p>
              </div>
            </button>

            <div className="flex items-center gap-3">
              <ThemeToggle size="sm" />
              <Button variant="outline" onClick={() => navigate("/login")}>
                Iniciar sesión
              </Button>
              <Button onClick={() => navigate("/register")}>
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
              Novedades curadas cada semana
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
              Compra libros originales con envíos en Bolivia
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explora catálogos infantiles, juveniles, clásicos y más. Pide en línea y recibe en tu puerta.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={() => navigate("/products")}>Ir a la tienda</Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/cart")}>
                Ver carrito
              </Button>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Icon name="check" size="sm" /> Pagos seguros</span>
              <span className="inline-flex items-center gap-2"><Icon name="check" size="sm" /> Envíos a domicilio</span>
              <span className="inline-flex items-center gap-2"><Icon name="check" size="sm" /> Catálogo curado</span>
            </div>
          </div>

          <Card className="relative border-primary/20 shadow-lg shadow-primary/10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent dark:from-primary/15" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Búsqueda rápida</h3>
                <span className="text-xs text-muted-foreground">Encuentra por título o autor</span>
              </div>
              <div className="space-y-4">
                <Input placeholder="Buscar por título, autor o ISBN" className="w-full" />
                <div className="flex gap-3">
                  <Button className="flex-1">
                    <Icon name="search" size="sm" className="mr-2" />
                    Buscar
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/products")}>Ver catálogo</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="rounded-lg bg-muted/60 px-3 py-2">
                  <p className="font-semibold text-foreground">+250 títulos</p>
                  <p>Actualizamos semanalmente</p>
                </div>
                <div className="rounded-lg bg-muted/60 px-3 py-2">
                  <p className="font-semibold text-foreground">Top ventas</p>
                  <p>Infantiles y clásicos</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 dark:bg-neutral-900/40">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-primary font-semibold">Categorías</p>
              <h2 className="text-3xl font-bold">Explora por intereses</h2>
              <p className="text-muted-foreground mt-2">Descubre las líneas más buscadas o navega por todas.</p>
            </div>
            <Button variant="outline" onClick={() => navigate("/products")}>
              Ver todas las categorías
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCards.map((category, index) => (
              <button
                key={`${category.name}-${index}`}
                onClick={() => navigate(category.link)}
                className="group relative overflow-hidden rounded-2xl border border-border shadow-sm hover:-translate-y-1 transition-transform"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${category.image})` }}
                  aria-hidden
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/65 to-background dark:from-neutral-950/30 dark:via-neutral-950/70 dark:to-neutral-950" />
                <div className="relative p-6 flex flex-col h-full justify-between">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-primary/15 text-primary font-semibold">
                      {category.description ? "Popular" : "Disponible"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-primary font-semibold mt-4">
                    Descubrir
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">{"\u003e"}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Banner */}
      <section
        className="relative w-full min-h-[320px] overflow-hidden"
        style={{
          backgroundImage: "url(/img/fondo3.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-primary/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/40 to-black/60" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-white space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-white/80">Visítanos</p>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Librería física en Cochabamba
          </h2>
          <p className="text-lg text-white/85 max-w-3xl mx-auto">
            Explora catálogo en vivo, recoge tus pedidos o vive nuestras experiencias literarias.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
              Planificar visita
            </Button>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-primary/80 text-white hover:bg-primary">
              Horarios y mapa
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-primary font-semibold">Destacados</p>
              <h2 className="text-3xl font-bold">Novedades de la semana</h2>
              <p className="text-muted-foreground mt-2">Basado en lo que más compran nuestros lectores.</p>
            </div>
            <Button onClick={() => navigate("/products")}>Ver todos los libros</Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredBooks.map((book) => (
                <BookCardVariant2
                  key={book.bookId}
                  book={book}
                  author={book.author}
                  category={book.category}
                  coverUrl={book.coverUrl}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/60 dark:bg-neutral-900/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <Card key={service.title} className="text-center space-y-3 h-full">
              <div className="text-4xl">{service.icon}</div>
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
              <div className="text-xs text-muted-foreground">0{index + 1}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Store Locations Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <p className="text-sm uppercase tracking-[0.25em] text-primary font-semibold">Nuestras Sucursales</p>
            <h2 className="text-3xl font-bold">Visítanos en cualquiera de nuestras ubicaciones</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Contamos con tres sucursales en Cochabamba con los mejores libros originales de literatura universal,
              latinoamericana, juvenil, infantil y nacional.
            </p>
          </div>

          {/* Map */}
          <div className="w-full">
            <StoreLocationsMap
              locations={storeLocations}
              height="500px"
              defaultZoom={12}
            />
          </div>

          {/* Store Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storeLocations.map((location) => (
              <Card key={location.locationId} className="space-y-4">
                {location.isPrimary && (
                  <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    Sucursal Principal
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{location.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {location.address}
                  </p>
                  <p className="text-sm text-muted-foreground">{location.city}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Icon name="clock" size="sm" className="mt-0.5 text-primary" />
                    <span className="text-muted-foreground">{location.openingHours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="phone" size="sm" className="text-primary" />
                    <span className="text-muted-foreground">{location.phone}</span>
                  </div>
                  {location.email && (
                    <div className="flex items-center gap-2">
                      <Icon name="mail" size="sm" className="text-primary" />
                      <span className="text-muted-foreground">{location.email}</span>
                    </div>
                  )}
                </div>
                {location.description && (
                  <p className="text-sm text-muted-foreground border-t border-border pt-4">
                    {location.description}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-neutral-950 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          <h3 className="text-xl font-semibold">Visítanos</h3>
          <p>Calle Colombia entre Aurelio Meleán y Julio Arauco #1069</p>
          <p>Cochabamba - Bolivia</p>
          <p>Lunes a viernes: 10:00 a 13:00 / 15:00 a 19:00</p>
          <p>Sábado: 10:00 a 13:00</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
