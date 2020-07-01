---
date: "2020-06-10"
title: "Calendar Application - Getting a Profile Photo"
tags: ["pi-calendar", "raspberry-pi", "web-development"]
type: "blog"
---

In my last blog post on this series, I explained using the HttpClient to make API calls to the Microsoft Graph, and the role the MsalInterceptor plays to authorize users.  In this blog post, I want to use the specific example of retrieving the profile photo and returning it as a blob to be viewed in an Angular page.

## Using the HttpClient to get the Profile Photo

First I need to make an API call to the Microsoft Graph.  The return of this API call is the actual photo itself.  So, unlike most times when calling an API that just returns json, it needs to return a blob.

```typescript
return this.httpClient.get('https://graph.microsoft.com/beta/me/photo/$value', {responseType: "blob"});
```

However, we want to be able to use this on a web page in an HTML img element.  This allows treating it like any other image on the page.  In order to do this we need to jump through a few hoops.  

First, we need to convert the blob to a URL.  With rx.js, I'm going to be using a pipe to map the source blob and output a URL that can be used in the img element. 

For this, we're going to use the [URL.createObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL) API.  This takes the blog, creates an in memory object to represent the image, and then returns a URL for it.

However, the resulting URL will hit Angular DOM sanitizer and fail to load.  To get around this, we need to inject the Angular DomSanitizer and bypass security for this URL to allow the URL to be used. 

```typescript
let url = this.sanitizer.bypassSecurityTrustUrl( window.URL.createObjectURL(image) );
```

Just be careful, remember the DomSanitizer is there to protect against XSS attacks.  Make sure the data is from a trusted source.  Since we are using this in the context of an image src, and we know it's a URL we generated from an in memory blob it should be safe to use.

Putting this altogether the class looks something like this.

```typescript
@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private client: HttpClient, private sanitizer: DomSanitizer) { 
  }

  getPhoto() {
    return this.client.get('https://graph.microsoft.com/beta/me/photo/$value', {responseType: "blob"})
      .pipe(map((image) => {
        const url = URL.createObjectURL(image);
        return this.sanitizer.bypassSecurityTrustUrl( url );
      }));
  }
}
```

One thing to note here, this is using the beta API to retrieve the profile photo.  This is because I have been using a personal Micrsoft account.  You can only obtain the profile photo for personal Microsoft accounts through the beta API currently.  The v1.0 API should work for Azure Active Directory accounts.

## Using the URL in Angular

The rest of the work is pretty typical Angular code.  Make a call to get the profile photo, and stash it away on a field within the class.

```typescript
this.calendar.getPhoto().subscribe((url) => this.profileUrl = url);
```

Then, use the profileUrl property in the img source to display it.

```html
<img *ngIf="this.profileUrl" [src]="this.profileUrl" />
```

I'm obviously leaving out any error checking, but this is all just to be a simple example.

## Wrapping Up

Now that it's possible to call a Graph API, it's possible to retrieve other data from the Graph API as well.  An example for the calendar application is appointment information.  There is a large variety of information Microsoft has made available via the API and will continue to make available.  [https://docs.microsoft.com/en-us/graph/](Go check out the documentation.)

Over the past few posts, I've shown how to build an application that uses the msal-angular library to login with a personal Microsoft account, call a Microsoft Graph API, and display a photo for the calendar application.
