import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export async function POST(request: Request) {
  try {
    const { email, sendEmail = true } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // 1. Create the onboarding record
    const { data: onboardingId, error: createError } = await supabase
      .rpc('create_onboarding', { p_email: email })

    if (createError) {
      console.error('Failed to create onboarding:', createError)
      return NextResponse.json(
        { error: 'Failed to create onboarding record' },
        { status: 500 }
      )
    }

    // 2. Build the registration link
    const contractLink = `${BASE_URL}/register/${onboardingId}`

    // 3. Optionally send the onboarding email
    if (sendEmail) {
      const emailResponse = await fetch(`${BASE_URL}/api/send-onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email, contractLink }),
      })

      if (!emailResponse.ok) {
        // Email failed but onboarding was created - return partial success
        return NextResponse.json({
          success: true,
          id: onboardingId,
          registrationLink: contractLink,
          emailSent: false,
          warning: 'Onboarding created but email failed to send',
        })
      }

      // 4. Mark email as sent
      await supabase.rpc('mark_onboarding_email_sent', { p_id: onboardingId })
    }

    return NextResponse.json({
      success: true,
      id: onboardingId,
      registrationLink: contractLink,
      emailSent: sendEmail,
      message: sendEmail 
        ? 'Onboarding created and email sent successfully'
        : 'Onboarding created successfully (email not sent)',
    })

  } catch (error) {
    console.error('Create onboarding error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', details: message },
      { status: 500 }
    )
  }
}

// GET: Retrieve onboarding stats
export async function GET() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.rpc('get_onboarding_stats')

    if (error) {
      console.error('Failed to get stats:', error)
      return NextResponse.json(
        { error: 'Failed to retrieve statistics' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      stats: data?.[0] || {
        total_count: 0,
        pending_count: 0,
        submitted_count: 0,
        approved_count: 0,
        rejected_count: 0,
      },
    })

  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

