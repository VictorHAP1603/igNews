import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from '../../services/prismic'


jest.mock('../../services/prismic');

const posts = [
    {
        slug: 'My newpost',
        title: 'My Newpost',
        excerpt: 'My excerpt',
        updatedAt: '2022-01-30',
    }
]


describe('Posts page', () => {
    it('renders correctly', () => {
        render(<Posts posts={posts} />)

        expect(screen.getByText("My Newpost")).toBeInTheDocument()
    })

    it("renders initial data", async () => {
        const getPrismicClientMocked = mocked(getPrismicClient);

        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'my-newpost',
                        data: {
                            title: [
                                { type: 'heading', text: 'my-newpost' }
                            ],
                            content: [
                                { type: "paragraph", text: 'my-newpost' }
                            ]
                        },
                        last_publication_date: '2021/04/03'
                    }
                ]
            })
        } as any)

        const response = await getStaticProps({});

        expect(response).toEqual(

            expect.objectContaining({
                props: {
                    posts: [
                        {
                            slug: 'my-newpost',
                            title: 'my-newpost',
                            excerpt: 'my-newpost',
                            updatedAt: '03 de abril de 2021',
                        }
                    ],
                }
            })

        )

    })
})