import { categories } from '../categories';
import CategoryClient from './CategoryClient';

export function generateStaticParams() {
  return categories.map((category) => ({
    category: category.slug,
  }));
}

type Props = {
  params: {
    category: string;
  };
};

export default function CategoryPage({ params }: Props) {
  return <CategoryClient category={params.category} />;
}

