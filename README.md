# npi-matcher

npi-matcher ingests doctor data provided by a healthcare provider, enriches it with each doctor's NPI number, and outputs a csv file of the resulting data

## Installing

### Prerequisites
- Node.js^10.0.0
- npm^5.6.0

### Instructions

A step by step series of examples that tell you how to get this tool up and running on your local machine.

1. Clone or download repository onto your local computer
```shell
git clone https://github.com/hchesnutt/npi-matcher
```

2. Navigate to root
```shell
$ cd ./cdminer
```

3. Install dependencies
```shell
$ npm install
```

4. Download example data (Mount Sinai Health Provider Data)
```shell
$ curl https://s3-us-west-1.amazonaws.com/hchesnutt-misc/mount_sinai_provider_data.json > mount_sinai_provider_data.json
```

5. Copy and rename config.example.json to config.json, add elasticsearch credentials


6. You're set!
```shell
$ node ./index.js
```

## Running tests

Tests have not been implemented for this project yet.


## Assumptions
npi-matcher was developed with the following assumptions:
- The NPI matching layer would need to generalize to other doctor data sources
- The matching logic would need to be flexible, and allow for complexity

## Design Notes
> After a cursory investigation of the data it became clear there were two big issues with matching doctors to their NPI number:
1. No foreign key relationship exists between NPI and Sinai meant that joining had to be done across multiple fields, with different levels of fuzzy matching.
2. NPI doctor data does not map a hospital provider to a doctor provider, so limiting NPI records to those including 'Sinai' would not work.
> I opted to seed an Elasticsearch cloud instance with the NPI data because:
1. It's scalable and performant. Computation for the matching logic won't be limited to a desktop.
2. ES excels at the type of searching I want to do. Implementing complex multi-column search with levenshtein distance is relatively painless, and I can boost certain results if a rarely filled-in column matches.
3. Setting up an elasticsearch service makes it easier to write custom matching criteria for other datasets.

It was important to me that the matching layer was not too tightly coupled with the data transformation logic, 
When designing this service, there were a few important requirements I 

## Reflections
> 

## Next Steps
Some features and next steps I considered but kept in the backlog.


## Built With

* [Node.js](https://nodejs.org/en/)
* [GitHub - chalk/chalk: 🖍 Terminal string styling done right](https://github.com/chalk/chalk)
* [csvtojson - npm](https://www.npmjs.com/package/csvtojson)

## Author

* **Henry Chesnutt**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Mom <3
