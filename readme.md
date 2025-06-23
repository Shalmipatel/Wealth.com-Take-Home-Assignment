This project uses the following:

- Node.js + Apollo Server for the GraphQL API
- SQLite (file-based, no external DB) through `sqlite3` 
- a custom JSON scalar so you can store and query the `assetInfo` blobs



## Prerequisites

- Node.js (v14 or newer) and npm installed



## Getting Started

1. **Clone the repository**
    
```bash
git clone https://github.com/Shalmipatel/Wealth.com-Take-Home-Assignment.git
cd Wealth.com-Take-Home-Assignment
```
    
2. **Install dependencies**

```bash
npm install
```

3. **Place your data file**

Ensure your assets.json (the provided dataset) is in the project root alongside package.json.

4. **Import assets.json into the database**

```bash
node import.js
```

This reads assets.json and creates db.sqlite with two tables.

You will see a new “db.sqlite” file appear

5. **Start the GraphQL server**

```bash
node index.js
```

6. **Access the Apollo server at** http://localhost:4000/

## Example Queries

Open your browser at **http://localhost:4000/** to launch playground.

**Get all assets’ latest balances**

```jsx
query {
  assets {
    id
    primaryCategory
    wealthType
    balanceCurrent
    balanceAsOf
  }
}
```

Expected response:

```jsx
{
  "data": {
    "assets": [
      {
        "id": "qJfnKleFCUW6rlYsKEGiEA",
        "primaryCategory": "Cash",
        "wealthType": "Cash",
        "balanceCurrent": 5000,
        "balanceAsOf": "2025-03-28T15:55:22+00:00"
      },
      ...
```

**Point-in-time query**

```jsx
query {
  assets(asOf: "2025-03-30T23:59:59Z") {
    id
    primaryCategory
    wealthType
    balanceCurrent
    balanceAsOf
  }
}
```

Expected response:

```jsx
{
  "data": {
    "assets": [
      {
        "id": "qJfnKleFCUW6rlYsKEGiEA",
        "primaryCategory": "Cash",
        "wealthType": "Cash",
        "balanceCurrent": 5000,
        "balanceAsOf": "2025-03-28T15:55:22+00:00"
      },
      {
        "id": "4Xal3Zc5Ekq1JBeFeq8veQ",
        "primaryCategory": "OtherProperty",
        "wealthType": "Vehicle",
        "balanceCurrent": 30000,
        "balanceAsOf": "2025-03-28T15:57:34+00:00"
      },
      {
        "id": "avRVVjwlXUCWsuciDZfbYg",
        "primaryCategory": "RealEstate",
        "wealthType": "RealEstate",
        "balanceCurrent": 800000,
        "balanceAsOf": "2025-03-28T15:59:49+00:00"
      },
      {
        "id": "b33J05h1jkaSuAEmWMPXaw",
        "primaryCategory": "Investment",
        "wealthType": "Brokerage",
        "balanceCurrent": 47500,
        "balanceAsOf": "2025-03-29T20:19:31+00:00"
      },
      {
        "id": "EuGiFOXJoECzFWT6t4sBfw",
        "primaryCategory": "RealEstate",
        "wealthType": "RealEstate",
        "balanceCurrent": 751200,
        "balanceAsOf": "2025-03-30T04:43:45+00:00"
      }
    ]
  }
}
```

# Design Decisions

- why this stack?
    - I chose using sqlite instead of postgres for the database because it requires no external setup, and can be imported through npm
    - Used plain JS instead of Typescript to save time
    - Apollo server makes it easy to test on the playground
    - assetInfo is dynamic for each asset, so i stored it as a dynamic blob to avoid writing migration, if the shape changes
- why this db structure?
    - created two db tables, one for static info (assets table)  and one for dynamic info (balances table)

ways to improve:
- parameterize query filter. right now the “asOf” parameter is injected directly into the sql query which is a risk for sql injection