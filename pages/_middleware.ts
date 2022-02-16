import type { NextFetchEvent, NextRequest } from 'next/server'

import { NextResponse } from 'next/server';
import { getPersonalizedRewrite } from '@builder.io/personalization-utils';
import Cookies from 'js-cookie'

// { "builder.userAttributes.domain": domain , 'builder.userAttributes.city': sf }


// /;urlPath="...";domain=domain;city=

const excludededPrefixes = ['/favicon', '/api'];

export function middleware(req: NextRequest, ev: NextFetchEvent) {

  const urlPath = req.nextUrl.pathname;
  let response = NextResponse.next();

  if (!excludededPrefixes.find(prefix => urlPath.startsWith(prefix))) {
    const destination = getPersonalizedRewrite(urlPath, {
      ...Cookies.get(),
      'builder.userAttributes.domain': req.headers.get('host') || '',
      'builder.userAttributes.city': req.geo?.city || '',
    });

    if (destination) {
      console.log('here desitination is ', destination);
      response = NextResponse.rewrite(destination)
    }
  }
  return response;
}
