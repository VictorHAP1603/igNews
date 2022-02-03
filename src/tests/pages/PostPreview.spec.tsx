import { render, screen } from "@testing-library/react";
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { mocked } from "jest-mock";
import { getPrismicClient } from '../../services/prismic'
import { getSession, useSession } from "next-auth/client";
import { useRouter } from 'next/router'

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../services/prismic');

const post = {
    slug: 'fake-slug',
    title: 'fake-title',
    content: 'fake-content',
    updatedAt: '2022-01-02'
}

describe("Post Preview Page", () => {
    it("renders correctly", () => {
        const useSessionMocked = mocked(useSession);

        useSessionMocked.mockReturnValueOnce([null, false])

        render(<PostPreview post={post} />)

        expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
        expect(screen.getByText("fake-title")).toBeInTheDocument();
        expect(screen.getByText("fake-content")).toBeInTheDocument();
    })

    it("redirects to origin post when user have a active subscription", () => {
        const useSessionMocked = mocked(useSession);
        const useRouterMocked = mocked(useRouter)
        const pushMocked = jest.fn()

        useSessionMocked.mockReturnValueOnce([{
            activeSubscription: 'fake-subscription'
        }, false]);

        useRouterMocked.mockReturnValueOnce({
            push: pushMocked
        } as any)

        render(<PostPreview post={post} />)

        expect(pushMocked).toHaveBeenCalledWith('/posts/fake-slug');
    })

    it("loads initial data", async () => {
        const getPrismicClientMocked = mocked(getPrismicClient)

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

        const response = await getStaticProps({
            params: {
                slug: 'fake-slug'
            }
        })

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