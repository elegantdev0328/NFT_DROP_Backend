var express = require('express');
var router = express.Router();
var {getBbHexProof, getBbGCFRoot, getBbCommunityRoot, getBbGCFHexProof, getBbCommunityHexProof, bbGcfClaim, bbCommunityClaim} = require('../Controller/MerkleCurryV2Controller');
var MiddlewareAuth = require('../Middleware/MiddlewareAuth')

router.get('/basketball/hex_proof/:gameId/:wallet', async(request, response) => {
    getBbHexProof(request, response);
});

router.get('/basketball/gcf/hex_proof/:wallet', async(request, response) => {
    getBbGCFHexProof(request, response);
});

router.get('/basketball/gcf/root', async(request, response) => {
    getBbGCFRoot(request, response);
});

router.post('/basketball/gcf/claim', MiddlewareAuth, async(request, response) => {
    bbGcfClaim(request, response);
});

router.get('/basketball/community/hex_proof/:wallet', async(request, response) => {
    getBbCommunityHexProof(request, response);
});

router.get('/basketball/community/root', async(request, response) => {
    getBbCommunityRoot(request, response);
});

router.post('/basketball/community/claim', MiddlewareAuth, async(request, response) => {
    bbCommunityClaim(request, response);
});

//

router.get('/serum/gcf/hex_proof/:wallet', async(request, response) => {
    getGCFHexProof(request, response);
});

router.get('/serum/gcf/root', async(request, response) => {
    getGCFRoot(request, response);
});

router.post('/serum/gcf/claim', MiddlewareAuth, async(request, response) => {
    gcfClaim(request, response);
});

router.get('/serum/community/hex_proof/:wallet', async(request, response) => {
    getCommunityHexProof(request, response);
});

router.get('/serum/community/root', async(request, response) => {
    getCommunityRoot(request, response);
});

router.post('/serum/community/claim', MiddlewareAuth, async(request, response) => {
    communityClaim(request, response);
});

module.exports = router;