'use server'

import MailerLite from '@mailerlite/mailerlite-nodejs'

const getMailerliteApi = () => {
    return new MailerLite({
        api_key: process.env.MAILER_LITE_TOKEN ?? '',
    })
}

export const subscribeToEmailList = async (email: string) => {
    const mailerliteApi = getMailerliteApi()
    const result = await mailerliteApi.subscribers.createOrUpdate({
        email: email,
        groups: ['175480858352813725'],
    })

    // Extract only serializable data to avoid circular references
    // The MailerLite SDK response may contain non-serializable objects
    // that cause "Maximum call stack size exceeded" when Next.js tries to serialize
    return {
        success: true,
        data: {
            data: result.data?.data
                ? {
                      id: result.data.data.id,
                      email: result.data.data.email,
                      status: result.data.data.status,
                  }
                : null,
        },
    }
}
