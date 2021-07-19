import { createClient } from 'contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Image from 'next/image'
import Skeleton from '../../components/Skeleton'

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env
const client = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
})

export default function RecipeDetails({ recipe }) {
  if (!recipe) return <Skeleton />
  const { featuredImage, title, cookingTime, ingredients, method } =
    recipe.fields
  return (
    <div>
      <div className="banner">
        <Image
          src={`https:${featuredImage.fields.file.url}`}
          height={featuredImage.fields.file.details.image.height}
          width={featuredImage.fields.file.details.image.width}
        />
        <h2> {title} </h2>
      </div>

      <div className="info">
        <p>Take about {cookingTime} mins to cook.</p>
        <h3>Ingredients</h3>
        {ingredients.map((ing) => (
          <span key={ing}>{ing}</span>
        ))}
      </div>

      <div className="method">
        <h3>Method:</h3>
        <div>{documentToReactComponents(method)}</div>
      </div>

      <style jsx>
        {`
          h2,
          h3 {
            text-transform: uppercase;
          }
          .banner h2 {
            margin: 0;
            background: #fff;
            display: inline-block;
            padding: 20px;
            position: relative;
            top: -60px;
            left: -10px;
            transform: rotateZ(-1deg);
            box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
          }
          .info p {
            margin: 0;
          }
          .info span::after {
            content: ', ';
          }
          .info span:last-child::after {
            content: '.';
          }
        `}
      </style>
    </div>
  )
}

export const getStaticPaths = async () => {
  const res = await client.getEntries({ content_type: 'recipe' })

  const paths = res.items.map((item) => {
    return {
      params: {
        slug: item.fields.slug,
      },
    }
  })

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps = async ({ params }) => {
  const { slug } = params
  const { items } = await client.getEntries({
    content_type: 'recipe',
    'fields.slug': slug,
  })

  return {
    props: {
      recipe: items[0],
    },
    revalidate: 1,
  }
}
