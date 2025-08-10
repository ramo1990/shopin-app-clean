import { getProduct } from '@/lib/api'
import { Product } from '@/lib/types'
import ProductPageClient from './ProductPageClient'


interface Params {
  slug: string;
}

interface ProductPageProps {
  params: Promise<Params>;
}


export async function generateMetadata({ params }: {params: Promise<Params> }){
  const { slug } = await params
  const product: Product = await getProduct(slug)

  return {
    title: `${product.title} | Shopin`,
    description: product.description || 'Détail du produit'
  }

}

export default async function ProductPage({params}: ProductPageProps) {
  const { slug } = await params
  return <ProductPageClient slug={slug} />
}
