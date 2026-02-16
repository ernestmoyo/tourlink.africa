import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Safari stories, travel insights, and expert guides from TourLink. Discover the latest trends in African travel, destination spotlights, and practical tips for planning your dream safari.',
};

const placeholderPosts = [
  {
    title: 'The Ultimate Guide to the Great Migration',
    image: '/images/packages/kenya-tanzania-migration.jpg',
    excerpt:
      'Everything you need to know about witnessing the world\'s greatest wildlife spectacle, from timing to the best vantage points across the Serengeti and Masai Mara.',
  },
  {
    title: 'KAZA Univisa: Everything You Need to Know',
    image: '/images/packages/wildlife-park.jpg',
    excerpt:
      'The KAZA Univisa simplifies travel between Zimbabwe and Zambia. Here\'s how it works, who qualifies, and how to make the most of this game-changing travel document.',
  },
  {
    title: 'Top 10 Luxury Lodges Opening in 2026',
    image: '/images/packages/big-five-luxury.jpg',
    excerpt:
      'From eco-conscious treehouses in Botswana to cliff-edge suites overlooking the Indian Ocean, these are the most anticipated new safari lodges of the year.',
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 md:py-28">
        <Container className="text-center">
          <span className="inline-block bg-magenta/20 text-magenta text-sm font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Coming Soon
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white max-w-3xl mx-auto">
            Safari Stories &amp; Travel Insights
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mt-4">
            Expert guides, destination spotlights, and insider tips to help you plan the
            ultimate African adventure. Our blog is launching soon.
          </p>
        </Container>
      </section>

      {/* Placeholder Posts */}
      <section className="py-20 bg-sand">
        <Container>
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest font-semibold text-magenta mb-3">
              On the Horizon
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-charcoal">
              Stories We&apos;re Working On
            </h2>
            <p className="text-lg text-slate max-w-2xl mx-auto mt-4">
              Our team is crafting in-depth articles to help you discover, plan, and
              experience Africa like never before.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {placeholderPosts.map((post) => (
              <article
                key={post.title}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Image with locked overlay */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-[50%] transition-all duration-500"
                  />
                  {/* Lock overlay */}
                  <div className="absolute inset-0 bg-navy/40 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate/60 mb-2">
                    Coming Soon
                  </p>
                  <h3 className="text-lg font-serif font-semibold text-charcoal mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-white">
        <Container variant="narrow">
          <div className="bg-navy rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
              Be the First to Read Our Stories
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
              Subscribe to get notified when our blog launches, plus receive exclusive
              travel insights and early access to new safari packages.
            </p>
            <form
              action="#"
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <label htmlFor="blog-email" className="sr-only">
                Email address
              </label>
              <input
                id="blog-email"
                type="email"
                placeholder="you@example.com"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-magenta focus:outline-none focus:ring-2 focus:ring-magenta/40 transition-colors"
                required
              />
              <Button variant="primary" type="submit">
                Subscribe
              </Button>
            </form>
            <p className="text-white/50 text-xs mt-4">
              No spam, ever. Unsubscribe at any time.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
