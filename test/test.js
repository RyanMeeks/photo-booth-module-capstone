'use strict'

const mocha = require('mocha');
const chai = require('chai');
const mongoose = require('mongoose');
const faker = require('faker');
const chaiHttp = require('chai-http');
const { app } = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('PhotBooth Module API Resource', function(){
    it('should return hello world', function(){
        let res;
        return chai.request(app)
        .get('')
        .then(function(_res){
            res = _res;
            res.should.have.status(200);
        })
    })
})