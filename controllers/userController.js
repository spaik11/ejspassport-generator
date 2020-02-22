const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch');
const { validationResult } = require('express-validator');

module.exports = {
    home: (req, res) => {
        if (req.isAuthenticated()) {
            return res.render('main/options');
        }
        return res.render('main/index');
    },

    authOptions: (req, res) => {
        if (!req.isAuthenticated()) return res.render('main/error');

        return res.render('main/options');
    },

    register:  (req, res) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            console.log(errors)
            return res.render('main/index', { regErrors: 'All inputs must be filled', errors: 'All inputs must be filled' });
        }

        User.findOne({ email: req.body.email }).then(user => {
            if (user) {
                return res.render('main/index', { regErrors: 'This email already registered' });
            }
            const newUser = new User();
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);
    
            newUser.name = req.body.name;
            newUser.email = req.body.email;
            newUser.password = hash;
    
            newUser
                .save()
                .then(user => {
                    req.login(user, (err) => {
                        if(err) {
                            return res.status(500).json({ message: 'Server Error' })
                        } else {
                            return res.redirect('/auth/options/')
                        }
                    })
                })
                .catch(err => reject(err));
        });
    },    

    logout: (req, res) => {
        req.logout();
        return res.redirect('/');
    },

    getRandomUsers: (req, res) => {
        if (req.user === undefined) return res.render('main/error');
    
        const url = 'https://randomuser.me/api/?results=30';
    
        fetch(url)
            .then((res) => res.json())
            .then((users) => {
                const sortedUsers = users.results.sort((a, b) => (a.name.last > b.name.last) ? 1 : ((b.name.last > a.name.last) ? -1 : 0))
                res.render('main/random', { sortedUsers });
            })
            .catch((err) => console.log(err));
    },

    getMovies: (req, res) => {
        if (req.user === undefined) return res.render('main/error');
    
        const url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=';
        const urlEnd = '&language=en-US&page=1';
        const apiKey = process.env.API_KEY
        const img = 'https://image.tmdb.org/t/p/w500';
    
        fetch(url+apiKey+urlEnd)
            .then((res) => res.json())
            .then((movies) => {
                res.render('main/movies', { movies, img })
            })
            .catch((err) => console.log(err))
    }
};