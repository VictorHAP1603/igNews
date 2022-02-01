import { render, screen, fireEvent } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { signIn, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { SubscribeButton } from '.'

jest.mock('next-auth/client')
jest.mock('next/router')

describe("SubscribeButton Component", () => {
    it("renders correctly", () => {
        const useSessionMocked = mocked(useSession)
        useSessionMocked.mockReturnValueOnce([null, false])

        render(
            <SubscribeButton />
        )

        expect(screen.getByText("Subscribe Now")).toBeInTheDocument();
    })

    it("redirects user to sign in when not authenticated", () => {
        const useSessionMocked = mocked(useSession)
        const signInMocked = mocked(signIn)

        useSessionMocked.mockReturnValueOnce([null, false])

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText("Subscribe Now")
        fireEvent.click(subscribeButton)

        expect(signInMocked).toHaveBeenCalled()

    })

    it("redirects to posts when user already has a subscription", () => {
        const useRouterMocked = mocked(useRouter);
        const useSessionMocked = mocked(useSession)
        const pushMock = jest.fn()

        useSessionMocked.mockReturnValueOnce([{
            user: {
                name: "John Doe",
                email: "johdoe@hotmail.com",
            },
            expires: "fake-expires",
            activeSubscription: 'fake-active-subscription'
        }, false])

        useRouterMocked.mockReturnValueOnce({
            push: pushMock
        } as any)

        render(<SubscribeButton />)

        const subscribeButton = screen.getByText("Subscribe Now")
        fireEvent.click(subscribeButton)

        expect(pushMock).toHaveBeenCalled()
    })
})