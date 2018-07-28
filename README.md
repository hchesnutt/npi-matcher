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

4. Download example data (Mount Sinai Health Provider Data), must be in root directory

```shell
$ curl <Mount sinai source> > mount_sinai_provider_data.json
```

5. Copy and rename config.example.json to config.json, add elasticsearch credentials

```json
{
  "USER": "USERNAME_HERE",
  "KEY": "USER_KEY_HERE"
}
```

6. You're set!

```shell
$ node ./index.js
```

## Running tests

Tests have not been implemented for this project yet.


## Assumptions

npi-matcher was developed with the following assumptions:

- The biggest hurdle is matching the Sinai unique key to NPI number. If this can be done joining the data between two SQL tables wouldn't be a problem
- The NPI matching layer needs to generalize to many other doctor data sources
- The matching logic would need to be flexible, and allow for complexity

## Design Notes

After a cursory investigation of the data it became clear there were two big issues with matching doctors to their NPI number:

- No foreign key relationship exists between NPI and Sinai means that joining has to be done across multiple fields, with different levels of fuzzy matching
- NPI doctor data doesn't map a hospital provider to a doctor provider, so limiting NPI records to those including 'Sinai' doesn't work

I opted to seed an Elasticsearch cloud instance with the NPI data for the following reasons:

- It's scalable and performant. Computation for the matching logic isn't be limited to a personal computer.
- ES excels at the type of searching I want to do. Implementing complex multi-column search is relatively painless, and I can boost certain results if an edgecase column matches.
- Setting up an elasticsearch service makes it easier to write custom matching criteria for datasets from other hospital systems.
- Deployment would be much easier; seeding elasticsearch with NPI data would only have to be done once, an important consideration if this tool is to be used on other computers.

To seed Elasticsearch I extracted the NPI data from the behemoth csv file (thanks CMS), filtered it down to only 'NY' records, converted it to JSON, transformed it into elasticsearch compatible ND-JSON, and bulk uploaded into the cloud. This logic can be found a bash script in `./elasticLoader/extractTransformLoad.sh`.

Once I had the NPI Providers indexed into ES, I requested the best match for each Sinai doctor based on exact First/Last names, and a Levenshtein distance weighted match on middle name, gender, and degree.`

Once doctors are matched, the enriched data is written to csv and JSON files in the root directory.

## Reflections
I think elasticsearch is a decent tool for this job. So, I was happy that after many failed attempts I was able to seed it successfully. However, this was a new technology for me so the cost of getting it running and working how I wished absorbed more time than I had budgeted for, leaving me in a rush to write the matching logic... which is not my cleanest nor proudest work.

- The utils file too big and should be broken out
- Some functions have side effects and could be refactored into pure functions
- I didn't notice until too late that some Sinai doctors had patient locations. I could have used this for additional matching.
- I'm curious if NPI_score (from elasticsearch _score) is a good predictor of a match, if so I might be able to exclude matches below a certian threshold, eliminating some false positive matches.

## Next Steps
Some features and next steps I considered but kept in the backlog.

1. Querying is done one at a time using a rate limiter. Batching queries and writing the results to file as they arrive would be more performant.
2. I'd like to spend more time tweaking the matching queries to queeze out better matches. I hypothesize a 5%-10% improvement could be found here.
3. Sinai has hospital affiliations and NPI has Provider Work Address. These could be leveraged for even better matching using google maps API to retrieve affilition lat/lon coordinates, which could be compared to NPI work address coordinates.
4. Data transformation and merging need to be their own separate modules. In this project they ended up being tightly coupled with many assumptions about the order of inputs and outputs. Refactoring could improve readability, perfomance, and future development flexibility.
5. csv/json destination files should be written concurrently, not syncronously one after the other.
6. Add more cli functionality, eg accept source file and destination path arguments, flags for source file, etc.
7. Maintain analytics for number of matched records. Average ES score, number of matched records, avg number of hits.
8. Add NPI data for all states

## Built With

- [Node.js](https://nodejs.org/en/)
- [Open Source Search & Analytics · Elasticsearch | Elastic](https://www.elastic.co/)
- [elasticsearch.js | Elastic](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)
- [csvtojson - npm](https://www.npmjs.com/package/csvtojson)
- [GitHub - chalk/chalk: 🖍 Terminal string styling done right](https://github.com/chalk/chalk)
- [ora - npm](https://www.npmjs.com/package/ora)

## Author

- **Henry Chesnutt** - *t.henry.chesnutt@gmail.com*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Mom <3
