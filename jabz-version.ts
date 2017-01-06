//User object
let joeUser = {
    name: 'joe',
    email: 'joe@example.com',
    prefs: {
        languages: {
            primary: 'sp',
            secondary: 'en'
        }
    }
};

//Global indexURLs map for different languages
let indexURLs = {
    'en': 'http://mysite.com/en',  //English
     'sp': 'http://mysite.com/sp', //Spanish
    'jp': 'http://mysite.com/jp'   //Japanese
}
//apply url to window.location
const showIndexPage = (url) => console.log('url: ' + url);

//Functional Programming:
//(Little hard to understand at first but is more robust and bug free)
//FP techniques used: Functors, "Maybe Monad" and "Currying"
// const R = require('ramda');
import * as R from 'ramda';
const prop = R.prop;
const path = R.path;
const curry = R.curry;
// const Maybe = require('ramda-fantasy').Maybe;
// import {Either, right, left} from "jabz/either";
import { Maybe, just, nothing, isNothing, isJust, fromMaybe } from "jabz/maybe";

function maybeFromNullable(x) {
  return x == null ? nothing : just(x);
}

const getURLForUser = (user) => {
    return maybeFromNullable(user)//wrap user in a Maybe object
        .map(path(['prefs', 'languages', 'primary'])) //use Ramda's to grab primary language
        .chain(maybeGetUrl); //pass language to maybeGetUrl &  get url or null Monad
}

const maybeGetUrl = R.curry(function(allUrls, language) {//curry to convert this to a single arg func
    return maybeFromNullable(allUrls[language]);//return Monad(url | null)
})(indexURLs);//pass indexURLs instead of accessing globally


function boot(user, defaultURL) {
    const userUrl = getURLForUser(user);
    // console.log('user URL: ', userUrl);
    // console.log('nothing: ', nothing);
    // console.log('isNothing: ', isNothing(userUrl));
    // console.log('userUrl === nothing: ', userUrl === nothing);
    // console.log('userUrl == nothing: ', userUrl == nothing);
    // console.log('nothing === nothing: ', nothing === nothing);
    // console.log('isNothing(nothing): ', isNothing(nothing));
    const url = fromMaybe(defaultURL, userUrl);
    // console.log('boot default: ', defaultURL);
    // console.log('boot url: ', url);
   showIndexPage(url);
}

boot(joeUser, 'http://site.com/en'); //'http://site.com/sp'
boot(undefined, 'undefined url');
boot(null, 'null url');