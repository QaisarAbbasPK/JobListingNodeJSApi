var express = require('express');
var router = express.Router();
const jobModel = require('../models/jobModel');

//Response Error Validation Function Define
const errorFormatter = e => {
  let errors = {};
  //"message": "joblisting validation failed: title: title is required, company: company name is required, location: location is required, email: email is required, leave_type: select leave type monthly, weekly, or seldom"
  const allErrors = e.substring(e.indexOf(':') + 1).trim();
  const allErrorsInArrayFormate = allErrors.split(',').map(err => err.trim());
  allErrorsInArrayFormate.forEach(error => {
     const [key, value] = error.split(':').map(err => err.trim());
     errors[key] = value;
  })

  return errors;

};

//Get All Job Listing
router.get('/jobs', (req, res, next) => {
      jobModel.find()
      .then(jobs => {
        if (!jobs) {
          return res.status(404).json({
            message: "Jobs Listing not found"
          });
        }

        res.status(200).json({
          count: jobs.length,
          title: jobs.map(job => {
            return {
              _id: job._id,
              title: job.title,
              company: job.company,
              location: job.location,
              email: job.email,
              leave_type: job.leave_type,
              date: job.date,
              trending: job.trending,
              request: {
                type: "GET",
                url: "http://localhost:8000/api/jobs/" + job._id
              }
            }
          })
        });
           
      }).catch(error => {
        res.status(404).json(error);
      })
});


//Create New Job Listing
router.post('/jobs', (req, res, next) => {
  const {title, company, location, email, leave_type} = req.body;
   new jobModel({
     title : title,
     company: company, 
     location: location, 
     email: email, 
     leave_type: leave_type
    })
   .save()
   .then(result => {
     res.status(201).json({
            message: "Created job successfully",
            createdJob: {
            _id: result._id,
            title : result.title,
            company: result.company, 
            location: result.location, 
            email: result.email, 
            leave_type: result.leave_type,
            request: {
                type: 'GET',
                url: "http://localhost:8000/api/jobs/" + result._id
            }
          }
       });
   }).catch(e => {
     res.status(404).json(
       errorFormatter(e.message)
     )
   })
});

// router.post("/jobs", (req, res, next) => {
//   const newJobsListing = new jobModel({
//     _id: new mongoose.Types.ObjectId(),
//     title : title,
//     company: company, 
//     location: location, 
//     email: email, 
//     leave_type: leave_type
//   });
//   newJobsListing
//     .save()
//     .then(result => {
//       console.log(result);
//       res.status(201).json({
//         message: "Created job successfully",
//         createdJob: {
//             _id: result._id,
//             title : result.title,
//             company: result.company, 
//             location: result.location, 
//             email: result.email, 
//             leave_type: result.leave_type,
//             request: {
//                 type: 'GET',
//                 url: "http://localhost:8000/api/jobs/" + result._id
//             }
//         }
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json(
//         errorFormatter(e.message)
//       );
//     });
// });


//Get Single Job Listing
router.get("/jobs/:id", (req, res, next) => {
  const id = req.params.id;
  jobModel.findById(id)
    .exec()
    .then(job => {
      if (job) {
        res.status(200).json({
            listing: job,
            request: {
                type: 'GET',
                url: 'http://localhost:8000/jobs/'
            },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});


//Delete Job Listing
router.delete("/jobs/:id", (req, res, next) => {
  const id = req.params.id;
  jobModel.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Job Listing deleted',
          request: {
              type: 'POST',
              url: 'http://localhost:8000/api/jobs/',
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


//Update Job Listing
router.patch('/jobs/:id', (req, res, next) => {
  const id = req.params.id;
  jobModel.findByIdAndUpdate(id, req.body, {
          new: true
      },
      function(err, model) {
          if (!err) {
              res.status(201).json({
                  data: model,
                  message: 'Job listing updated',
                  request: {
                      type: 'GET',
                      url: 'http://localhost:8000/api/jobs/' + id
                  }
              });
          } else {
              res.status(500).json({
                  message: "not found any relative data"
              })
          }
      });
});





//export router module
module.exports = router;