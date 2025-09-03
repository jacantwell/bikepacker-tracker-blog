import Container from '@/components/layout/Container';
import PostHeader from '@/components/blog/PostHeader';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import { PLANNED_ROUTE_POST, PlannedRoutePost } from '@/data/plannedRoutePost';
import RouteMap from '@/components/journey/RouteMap';
// Planned route ID

const PLANNED_ROUTE_ID = '3398297883408418150';

interface PlannedRoutePageProps {
  post?: PlannedRoutePost;
  routeId?: string;
}

const PlannedRoutePage = ({ post = PLANNED_ROUTE_POST, routeId = PLANNED_ROUTE_ID }: PlannedRoutePageProps) => {

  return (
    <Container>
      <article className="mb-32">
        <PostHeader
          title={post.title}
          coverImage={post.coverImage}
          date={post.date}
          author={post.author}
        />
        
        {/* First part of the content */}
        <div className="max-w-2xl mx-auto">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* The planned route map - will try to load from Strava, fallback to mock */}
        <div className="my-12">
          <RouteMap routeId={routeId} />
        </div>

        {/* Second part of the content */}
        <div className="max-w-2xl mx-auto">
          <MarkdownRenderer content={post.contentAfterMap} />
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 dark:border-gray-800">
          <a
            href="/"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            ← Back to home
          </a>
        </div>
      </article>
    </Container>
  );
};

export default PlannedRoutePage;