import { Hero } from '../components/Hero';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { Values } from '../components/Values';
import { Story } from '../components/Story';
import { Guarantees } from '../components/Guarantees';
import { ProductCatalog } from '../components/ProductCatalog';

export function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Values />
      <Story />
      <Guarantees />
      <ProductCatalog />
    </>
  );
}
