/* tslint:disable */
/* eslint-disable */
/**
 * Bikepacker Tracker API
 * API for the Bikepacker Tracker blog
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from './configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
import type { RequestArgs } from './base';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, BaseAPI, RequiredError, operationServerMap } from './base';

/**
 * 
 * @export
 * @interface Author
 */
export interface Author {
    /**
     * 
     * @type {string}
     * @memberof Author
     */
    'id': string;
    /**
     * 
     * @type {string}
     * @memberof Author
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof Author
     */
    'picture': string;
    /**
     * 
     * @type {string}
     * @memberof Author
     */
    'bio'?: string | null;
}
/**
 * 
 * @export
 * @interface HTTPValidationError
 */
export interface HTTPValidationError {
    /**
     * 
     * @type {Array<ValidationError>}
     * @memberof HTTPValidationError
     */
    'detail'?: Array<ValidationError>;
}
/**
 * 
 * @export
 * @interface OgImage
 */
export interface OgImage {
    /**
     * 
     * @type {string}
     * @memberof OgImage
     */
    'url': string;
}
/**
 * 
 * @export
 * @interface PaginatedPosts
 */
export interface PaginatedPosts {
    /**
     * 
     * @type {Array<Post>}
     * @memberof PaginatedPosts
     */
    'posts': Array<Post>;
    /**
     * 
     * @type {number}
     * @memberof PaginatedPosts
     */
    'total': number;
    /**
     * 
     * @type {number}
     * @memberof PaginatedPosts
     */
    'page': number;
    /**
     * 
     * @type {number}
     * @memberof PaginatedPosts
     */
    'per_page': number;
    /**
     * 
     * @type {number}
     * @memberof PaginatedPosts
     */
    'total_pages': number;
}
/**
 * 
 * @export
 * @interface Post
 */
export interface Post {
    /**
     * 
     * @type {string}
     * @memberof Post
     */
    'slug': string;
    /**
     * 
     * @type {string}
     * @memberof Post
     */
    'title': string;
    /**
     * 
     * @type {string}
     * @memberof Post
     */
    'date': string;
    /**
     * 
     * @type {string}
     * @memberof Post
     */
    'excerpt': string;
    /**
     * 
     * @type {Author}
     * @memberof Post
     */
    'author': Author;
    /**
     * 
     * @type {string}
     * @memberof Post
     */
    'coverImage': string;
    /**
     * 
     * @type {Array<string>}
     * @memberof Post
     */
    'tags': Array<string>;
    /**
     * 
     * @type {OgImage}
     * @memberof Post
     */
    'ogImage': OgImage;
    /**
     * 
     * @type {string}
     * @memberof Post
     */
    'content': string;
    /**
     * 
     * @type {string}
     * @memberof Post
     */
    'rawContent': string;
}
/**
 * 
 * @export
 * @interface ValidationError
 */
export interface ValidationError {
    /**
     * 
     * @type {Array<ValidationErrorLocInner>}
     * @memberof ValidationError
     */
    'loc': Array<ValidationErrorLocInner>;
    /**
     * 
     * @type {string}
     * @memberof ValidationError
     */
    'msg': string;
    /**
     * 
     * @type {string}
     * @memberof ValidationError
     */
    'type': string;
}
/**
 * 
 * @export
 * @interface ValidationErrorLocInner
 */
export interface ValidationErrorLocInner {
}

/**
 * AuthorsApi - axios parameter creator
 * @export
 */
export const AuthorsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Get a specific author by ID
         * @summary Get Author
         * @param {string} authorId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAuthorApiAuthorsAuthorIdGet: async (authorId: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'authorId' is not null or undefined
            assertParamExists('getAuthorApiAuthorsAuthorIdGet', 'authorId', authorId)
            const localVarPath = `/api/authors/{author_id}`
                .replace(`{${"author_id"}}`, encodeURIComponent(String(authorId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get all authors
         * @summary Get Authors
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAuthorsApiAuthorsGet: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/authors`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * AuthorsApi - functional programming interface
 * @export
 */
export const AuthorsApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = AuthorsApiAxiosParamCreator(configuration)
    return {
        /**
         * Get a specific author by ID
         * @summary Get Author
         * @param {string} authorId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getAuthorApiAuthorsAuthorIdGet(authorId: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Author>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getAuthorApiAuthorsAuthorIdGet(authorId, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AuthorsApi.getAuthorApiAuthorsAuthorIdGet']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Get all authors
         * @summary Get Authors
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getAuthorsApiAuthorsGet(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<Author>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getAuthorsApiAuthorsGet(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['AuthorsApi.getAuthorsApiAuthorsGet']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * AuthorsApi - factory interface
 * @export
 */
export const AuthorsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = AuthorsApiFp(configuration)
    return {
        /**
         * Get a specific author by ID
         * @summary Get Author
         * @param {string} authorId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAuthorApiAuthorsAuthorIdGet(authorId: string, options?: RawAxiosRequestConfig): AxiosPromise<Author> {
            return localVarFp.getAuthorApiAuthorsAuthorIdGet(authorId, options).then((request) => request(axios, basePath));
        },
        /**
         * Get all authors
         * @summary Get Authors
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAuthorsApiAuthorsGet(options?: RawAxiosRequestConfig): AxiosPromise<Array<Author>> {
            return localVarFp.getAuthorsApiAuthorsGet(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * AuthorsApi - object-oriented interface
 * @export
 * @class AuthorsApi
 * @extends {BaseAPI}
 */
export class AuthorsApi extends BaseAPI {
    /**
     * Get a specific author by ID
     * @summary Get Author
     * @param {string} authorId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthorsApi
     */
    public getAuthorApiAuthorsAuthorIdGet(authorId: string, options?: RawAxiosRequestConfig) {
        return AuthorsApiFp(this.configuration).getAuthorApiAuthorsAuthorIdGet(authorId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Get all authors
     * @summary Get Authors
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AuthorsApi
     */
    public getAuthorsApiAuthorsGet(options?: RawAxiosRequestConfig) {
        return AuthorsApiFp(this.configuration).getAuthorsApiAuthorsGet(options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Health
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        healthHealthGet: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/health`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Read Root
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        readRootGet: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = DefaultApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary Health
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async healthHealthGet(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.healthHealthGet(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DefaultApi.healthHealthGet']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Read Root
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async readRootGet(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.readRootGet(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DefaultApi.readRootGet']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = DefaultApiFp(configuration)
    return {
        /**
         * 
         * @summary Health
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        healthHealthGet(options?: RawAxiosRequestConfig): AxiosPromise<any> {
            return localVarFp.healthHealthGet(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Read Root
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        readRootGet(options?: RawAxiosRequestConfig): AxiosPromise<any> {
            return localVarFp.readRootGet(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * 
     * @summary Health
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public healthHealthGet(options?: RawAxiosRequestConfig) {
        return DefaultApiFp(this.configuration).healthHealthGet(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Read Root
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public readRootGet(options?: RawAxiosRequestConfig) {
        return DefaultApiFp(this.configuration).readRootGet(options).then((request) => request(this.axios, this.basePath));
    }
}



/**
 * PostsApi - axios parameter creator
 * @export
 */
export const PostsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Get all unique tags used in posts
         * @summary Get All Tags
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAllTagsApiTagsGet: async (options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/tags`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get a specific post by slug
         * @summary Get Post
         * @param {string} slug 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPostApiPostsSlugGet: async (slug: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'slug' is not null or undefined
            assertParamExists('getPostApiPostsSlugGet', 'slug', slug)
            const localVarPath = `/api/posts/{slug}`
                .replace(`{${"slug"}}`, encodeURIComponent(String(slug)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get paginated posts, optionally filtered by tag
         * @summary Get Posts
         * @param {number} [page] Page number
         * @param {number} [perPage] Items per page
         * @param {string | null} [tag] Filter posts by tag
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPostsApiPostsGet: async (page?: number, perPage?: number, tag?: string | null, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/posts`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (page !== undefined) {
                localVarQueryParameter['page'] = page;
            }

            if (perPage !== undefined) {
                localVarQueryParameter['per_page'] = perPage;
            }

            if (tag !== undefined) {
                localVarQueryParameter['tag'] = tag;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get all posts with a specific tag
         * @summary Get Posts With Tag
         * @param {string} tag 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPostsWithTagApiPostsTagTagGet: async (tag: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'tag' is not null or undefined
            assertParamExists('getPostsWithTagApiPostsTagTagGet', 'tag', tag)
            const localVarPath = `/api/posts/tag/{tag}`
                .replace(`{${"tag"}}`, encodeURIComponent(String(tag)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * PostsApi - functional programming interface
 * @export
 */
export const PostsApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = PostsApiAxiosParamCreator(configuration)
    return {
        /**
         * Get all unique tags used in posts
         * @summary Get All Tags
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getAllTagsApiTagsGet(options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<string | null>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getAllTagsApiTagsGet(options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['PostsApi.getAllTagsApiTagsGet']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Get a specific post by slug
         * @summary Get Post
         * @param {string} slug 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getPostApiPostsSlugGet(slug: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Post>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getPostApiPostsSlugGet(slug, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['PostsApi.getPostApiPostsSlugGet']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Get paginated posts, optionally filtered by tag
         * @summary Get Posts
         * @param {number} [page] Page number
         * @param {number} [perPage] Items per page
         * @param {string | null} [tag] Filter posts by tag
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getPostsApiPostsGet(page?: number, perPage?: number, tag?: string | null, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<PaginatedPosts>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getPostsApiPostsGet(page, perPage, tag, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['PostsApi.getPostsApiPostsGet']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * Get all posts with a specific tag
         * @summary Get Posts With Tag
         * @param {string} tag 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getPostsWithTagApiPostsTagTagGet(tag: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<Post>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getPostsWithTagApiPostsTagTagGet(tag, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['PostsApi.getPostsWithTagApiPostsTagTagGet']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * PostsApi - factory interface
 * @export
 */
export const PostsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = PostsApiFp(configuration)
    return {
        /**
         * Get all unique tags used in posts
         * @summary Get All Tags
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAllTagsApiTagsGet(options?: RawAxiosRequestConfig): AxiosPromise<Array<string | null>> {
            return localVarFp.getAllTagsApiTagsGet(options).then((request) => request(axios, basePath));
        },
        /**
         * Get a specific post by slug
         * @summary Get Post
         * @param {string} slug 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPostApiPostsSlugGet(slug: string, options?: RawAxiosRequestConfig): AxiosPromise<Post> {
            return localVarFp.getPostApiPostsSlugGet(slug, options).then((request) => request(axios, basePath));
        },
        /**
         * Get paginated posts, optionally filtered by tag
         * @summary Get Posts
         * @param {number} [page] Page number
         * @param {number} [perPage] Items per page
         * @param {string | null} [tag] Filter posts by tag
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPostsApiPostsGet(page?: number, perPage?: number, tag?: string | null, options?: RawAxiosRequestConfig): AxiosPromise<PaginatedPosts> {
            return localVarFp.getPostsApiPostsGet(page, perPage, tag, options).then((request) => request(axios, basePath));
        },
        /**
         * Get all posts with a specific tag
         * @summary Get Posts With Tag
         * @param {string} tag 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getPostsWithTagApiPostsTagTagGet(tag: string, options?: RawAxiosRequestConfig): AxiosPromise<Array<Post>> {
            return localVarFp.getPostsWithTagApiPostsTagTagGet(tag, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * PostsApi - object-oriented interface
 * @export
 * @class PostsApi
 * @extends {BaseAPI}
 */
export class PostsApi extends BaseAPI {
    /**
     * Get all unique tags used in posts
     * @summary Get All Tags
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PostsApi
     */
    public getAllTagsApiTagsGet(options?: RawAxiosRequestConfig) {
        return PostsApiFp(this.configuration).getAllTagsApiTagsGet(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Get a specific post by slug
     * @summary Get Post
     * @param {string} slug 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PostsApi
     */
    public getPostApiPostsSlugGet(slug: string, options?: RawAxiosRequestConfig) {
        return PostsApiFp(this.configuration).getPostApiPostsSlugGet(slug, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Get paginated posts, optionally filtered by tag
     * @summary Get Posts
     * @param {number} [page] Page number
     * @param {number} [perPage] Items per page
     * @param {string | null} [tag] Filter posts by tag
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PostsApi
     */
    public getPostsApiPostsGet(page?: number, perPage?: number, tag?: string | null, options?: RawAxiosRequestConfig) {
        return PostsApiFp(this.configuration).getPostsApiPostsGet(page, perPage, tag, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Get all posts with a specific tag
     * @summary Get Posts With Tag
     * @param {string} tag 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof PostsApi
     */
    public getPostsWithTagApiPostsTagTagGet(tag: string, options?: RawAxiosRequestConfig) {
        return PostsApiFp(this.configuration).getPostsWithTagApiPostsTagTagGet(tag, options).then((request) => request(this.axios, this.basePath));
    }
}



