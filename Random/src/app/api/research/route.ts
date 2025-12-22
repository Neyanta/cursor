import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

interface ResearchInput {
  input: string;
}

interface ResearchSummary {
  businessSnapshot: {
    name: string;
    industry: string;
    location: string;
    description: string;
  };
  qualityAndReviews: {
    overallRating: string;
    ratingExplanation: string;
    reviewHighlights: string[];
    qualityIndicators: string[];
    negativeIndicators: string[];
  };
  distributionAndPricing: {
    distributionChannels: string[];
    pricingSignals: string[];
    marketPosition: string;
  };
  outreachPitch: {
    contactEmail: string;
    similarSPs: string[];
  };
}

// Replace the generateMockResearch function with this:
async function generateResearch(input: string): Promise<ResearchSummary> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini", // or "gpt-4" for better quality
    messages: [
      {
        role: "system",
        content: `You are a business research assistant for BDMs (Business Development Managers). 
        Analyze the provided business information and return a structured JSON response with this EXACT structure:
        {
          "businessSnapshot": {
            "name": "string",
            "industry": "string",
            "location": "string",
            "description": "string"
          },
          "qualityAndReviews": {
            "overallRating": "string (e.g., '4.5/5')",
            "ratingExplanation": "string - detailed explanation (3-5 sentences) that MUST include: (1) the total number of reviews analyzed, (2) the specific sources/platforms where reviews were found (e.g., Google Reviews, Yelp, TripAdvisor, Facebook, industry-specific platforms), (3) how the rating was calculated or determined based on these reviews, and (4) any notable patterns or trends observed across the review sources.",
            "reviewHighlights": ["string"],
            "qualityIndicators": ["string - positive indicators"],
            "negativeIndicators": ["string - negative quality indicators or concerns"]
          },
          "distributionAndPricing": {
            "distributionChannels": ["string"],
            "pricingSignals": ["string"],
            "marketPosition": "string"
          },
          "outreachPitch": {
            "contactEmail": "string - email address of the person/team who can help with partnership opportunities (e.g., 'partnerships@company.com' or 'business@company.com'). If not available, use 'info@[businessname].com' format or 'N/A' if truly unavailable.",
            "similarSPs": ["string - names of similar Service Providers or businesses in the same industry/niche that might also be good partnership opportunities. Include 2-5 recommendations if available, or empty array if none found"]
          }
        }
        
        Return ONLY valid JSON matching this exact structure. All fields are required.`
      },
      {
        role: "user",
        content: `Research this business: ${input}`
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  try {
    const parsed = JSON.parse(content) as ResearchSummary;
    
    // Validate and ensure all required fields exist with defaults
    return {
      businessSnapshot: {
        name: parsed.businessSnapshot?.name || 'Unknown Business',
        industry: parsed.businessSnapshot?.industry || 'Not specified',
        location: parsed.businessSnapshot?.location || 'Not specified',
        description: parsed.businessSnapshot?.description || 'No description available',
      },
      qualityAndReviews: {
        overallRating: parsed.qualityAndReviews?.overallRating || 'N/A',
        ratingExplanation: parsed.qualityAndReviews?.ratingExplanation || 'Rating explanation not available',
        reviewHighlights: Array.isArray(parsed.qualityAndReviews?.reviewHighlights) 
          ? parsed.qualityAndReviews.reviewHighlights 
          : [],
        qualityIndicators: Array.isArray(parsed.qualityAndReviews?.qualityIndicators)
          ? parsed.qualityAndReviews.qualityIndicators
          : [],
        negativeIndicators: Array.isArray(parsed.qualityAndReviews?.negativeIndicators)
          ? parsed.qualityAndReviews.negativeIndicators
          : [],
      },
      distributionAndPricing: {
        distributionChannels: Array.isArray(parsed.distributionAndPricing?.distributionChannels)
          ? parsed.distributionAndPricing.distributionChannels
          : [],
        pricingSignals: Array.isArray(parsed.distributionAndPricing?.pricingSignals)
          ? parsed.distributionAndPricing.pricingSignals
          : [],
        marketPosition: parsed.distributionAndPricing?.marketPosition || 'Not specified',
      },
      outreachPitch: {
        contactEmail: parsed.outreachPitch?.contactEmail || 'N/A',
        similarSPs: Array.isArray(parsed.outreachPitch?.similarSPs)
          ? parsed.outreachPitch.similarSPs
          : [],
      },
    };
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', parseError);
    console.error('Raw content:', content);
    throw new Error('Failed to parse OpenAI response. Please try again.');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ResearchInput = await request.json();
    const { input } = body;

    if (!input || input.trim().length === 0) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const researchSummary = await generateResearch(input);

    return NextResponse.json(researchSummary);
  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate research summary' },
      { status: 500 }
    );
  }
}

