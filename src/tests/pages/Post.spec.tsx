import { render, screen } from "@testing-library/react";
import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { mocked } from "jest-mock";
import { getPrismicClient } from '../../services/prismic'
import { getSession } from "next-auth/client";

jest.mock('next-auth/client');
jest.mock('../../services/prismic');

const post = {
    slug: 'fake-slug',
    title: 'fake-title',
    content: 'fake-content',
    updatedAt: '2022-01-02'
}

describe("Post Page", () => {
    it("renders correctly", () => {
        render(<Post post={post} />)

        expect(screen.getByText("fake-title")).toBeInTheDocument();
        expect(screen.getByText("fake-content")).toBeInTheDocument();
    })

    it("redirects to post preview when user does not have a subscription", async () => {
        const getSessionMocked = mocked(getSession);

        getSessionMocked.mockResolvedValueOnce(null)

        const response = await getServerSideProps({
            params: {
                slug: 'fake-slug'
            }
        } as any)


        expect(response).toEqual(
            expect.objectContaining({
                redirect: expect.objectContaining({
                    destination: "/posts/preview/fake-slug"
                })
            })
        )
    })

    it("loads initial data if user is authenticate", async () => {
        const getSessionMocked = mocked(getSession);
        const getPrismicClientMocked = mocked(getPrismicClient)

        getSessionMocked.mockResolvedValueOnce({
            activeSubscription: 'fake-active-subscription'
        });

        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type: 'heading', text: 'my-newpost' }
                    ],
                    content: [
                        { type: "paragraph", text: 'my-newpost' }
                    ]
                },
                last_publication_date: '02/02/2022'
            })
        } as any)

        const response = await getServerSideProps({
            params: {
                slug: 'fake-slug'
            }
        } as any)

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'fake-slug',
                        title: 'my-newpost',
                        content: '<p>my-newpost</p>',
                        updatedAt: '02 de fevereiro de 2022'
                    }
                }
            })
        )
    })
})