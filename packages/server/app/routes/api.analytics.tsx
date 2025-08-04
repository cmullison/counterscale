import type { LoaderFunctionArgs } from "react-router";
import {
    getDateTimeRange,
    getFiltersFromSearchParams,
    paramsFromUrl,
} from "~/lib/utils";
import { validateApiKey, createAuthResponse } from "~/lib/auth";

export async function loader({ context, request }: LoaderFunctionArgs) {
    // Validate API key
    if (!validateApiKey(request, context.cloudflare.env)) {
        return createAuthResponse();
    }

    const { analyticsEngine } = context;
    const url = new URL(request.url);
    
    // Get parameters
    const siteId = url.searchParams.get("siteId");
    const interval = url.searchParams.get("interval") || "24h";
    const tz = url.searchParams.get("timezone") || "UTC";
    const endpoint = url.searchParams.get("endpoint") || "stats";
    
    if (!siteId) {
        return new Response("Missing required parameter: siteId", { status: 400 });
    }

    const filters = getFiltersFromSearchParams(url.searchParams);

    try {
        let data;
        
        switch (endpoint) {
            case "stats": {
                // Get overall statistics
                const earliestEvents = analyticsEngine.getEarliestEvents(siteId);
                const counts = await analyticsEngine.getCounts(siteId, interval, tz, filters);
                const { earliestEvent, earliestBounce } = await earliestEvents;
                const { startDate } = getDateTimeRange(interval, tz);

                const hasSufficientBounceData =
                    earliestBounce !== null &&
                    earliestEvent !== null &&
                    (earliestEvent.getTime() == earliestBounce.getTime() ||
                        earliestBounce < startDate);

                const bounceRate =
                    counts.visitors > 0 ? counts.bounces / counts.visitors : undefined;

                data = {
                    views: counts.views,
                    visitors: counts.visitors,
                    bounceRate: bounceRate,
                    hasSufficientBounceData,
                };
                break;
            }
            
            case "timeseries": {
                // Get time series data for charts
                data = await analyticsEngine.getTimeseries(siteId, interval, tz, filters);
                break;
            }
            
            case "paths": {
                // Get page analytics
                const limit = parseInt(url.searchParams.get("limit") || "10");
                const offset = parseInt(url.searchParams.get("offset") || "0");
                data = await analyticsEngine.getTopPaths(siteId, interval, tz, filters, limit, offset);
                break;
            }
            
            case "referrers": {
                // Get referrer data
                const limit = parseInt(url.searchParams.get("limit") || "10");
                const offset = parseInt(url.searchParams.get("offset") || "0");
                data = await analyticsEngine.getTopReferrers(siteId, interval, tz, filters, limit, offset);
                break;
            }
            
            case "countries": {
                // Get country data
                const limit = parseInt(url.searchParams.get("limit") || "10");
                const offset = parseInt(url.searchParams.get("offset") || "0");
                data = await analyticsEngine.getTopCountries(siteId, interval, tz, filters, limit, offset);
                break;
            }
            
            case "browsers": {
                // Get browser data
                const limit = parseInt(url.searchParams.get("limit") || "10");
                const offset = parseInt(url.searchParams.get("offset") || "0");
                data = await analyticsEngine.getTopBrowsers(siteId, interval, tz, filters, limit, offset);
                break;
            }
            
            case "devices": {
                // Get device data
                const limit = parseInt(url.searchParams.get("limit") || "10");
                const offset = parseInt(url.searchParams.get("offset") || "0");
                data = await analyticsEngine.getTopDevices(siteId, interval, tz, filters, limit, offset);
                break;
            }
            
            case "events": {
                // Get event data
                const limit = parseInt(url.searchParams.get("limit") || "10");
                const offset = parseInt(url.searchParams.get("offset") || "0");
                data = await analyticsEngine.getTopEvents(siteId, interval, tz, filters, limit, offset);
                break;
            }
            
            default:
                return new Response(`Unknown endpoint: ${endpoint}`, { status: 400 });
        }

        return new Response(JSON.stringify(data), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "public, max-age=300" // 5 minute cache
            },
        });
        
    } catch (error) {
        console.error("Analytics API error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

// Handle OPTIONS requests for CORS
export async function options() {
    return new Response(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Authorization, X-API-Key, Content-Type",
        },
    });
}