const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop' },
    { name: 'Fashion', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=300&fit=crop' },
    { name: 'Home & Living', img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=300&fit=crop' },
    { name: 'Beauty', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop' },
    { name: 'Sports', img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=300&fit=crop' },
    { name: 'Books', img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop' },
    { name: 'Toys', img: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop' },
    { name: 'Automotive', img: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=400&h=300&fit=crop' }
  ];

  for (const c of categories) {
    const slug = c.name.toLowerCase().replace(/ /g, '-');
    await prisma.category.upsert({
      where: { slug },
      update: { imageUrl: c.img },
      create: { name: c.name, slug, imageUrl: c.img }
    });
  }
  console.log('Categories seeded!');
}
main().finally(() => prisma.$disconnect());

