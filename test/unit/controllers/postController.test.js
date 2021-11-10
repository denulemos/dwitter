const Post = require('../../../schemas/PostSchema');
const mongoose = require('mongoose');
const { describe, it } = require('mocha');
const assert = require("chai").assert;
const util = require('util');
const httpMocks = require('node-mocks-http');
const controller = require("../../../controllers/postController");

describe('Get posts', function() {
    it('when everything is ok', async function(done) {

        const data = {
            contenido: "Testing post",
            autor: mongoose.Types.ObjectId(),
        };


        const postCreated = await Post.create(data);

        const req  = httpMocks.createRequest({
            method: 'GET',
            url: '/post/',
            body: {}
        });

        const res = httpMocks.createResponse();

        const posts = controller.getPosts(req, res)

        done();

        /*Post.create(data)
        .then(async (post) => {
            const req  = httpMocks.createRequest({
                method: 'GET',
                url: '/post/',
                body: {}
            });
    
            const res = httpMocks.createResponse();
    
            const posts = controller.getPosts(req, res)

            done();
        })
        .catch((e) => {
            console.log(e);
        });*/
    
        /*const req  = httpMocks.createRequest({
            method: 'GET',
            url: '/post/',
            body: {}
        });

        const res = httpMocks.createResponse();

        const posts = controller.getPosts(req, res)*/
    });
});

const createPost = async (data) => {
    return Post.create(data)
        .then(async (post) => {
            return post;
        })
        .catch((e) => {
            console.log(e);
        });
}
