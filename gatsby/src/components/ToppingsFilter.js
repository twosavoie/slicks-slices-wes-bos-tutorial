import React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import styled from 'styled-components';

const ToppingsStyles = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 4rem;
  a {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 0 1rem;
    align-items: center;
    padding: 5px;
    background: var(--grey);
    border-radius: 2px;
    text-decoration: none;
    font-size: clamp(1.5rem, 1.4vw, 2.5rem);
    .count {
      background: white;
      padding: 2px 5px;
    }
    &[aria-current='page'] {
      background: var(--yellow);
    }
  }
`;

function countPizzasInToppings(pizzas) {
  // return the pizzas in count
  const counts = pizzas
    .map((pizza) => pizza.toppings)
    .flat()
    .reduce((acc, topping) => {
      // check if this is an existing topping,
      const existingTopping = acc[topping.id];

      if (existingTopping) {
        // if it is, increment by 1
        existingTopping.count += 1;
      } else {
        // otherwise create a new entry in our acc and set it to one
        acc[topping.id] = {
          id: topping.id,
          name: topping.name,
          count: 1,
        };
      }
      return acc;
    }, {});
  // sort them based on their count
  const sortedToppings = Object.values(counts).sort(
    (a, b) => b.count - a.count
  );
  return sortedToppings;
}

export default function ToppingsFilter({ activeTopping }) {
  // get a list of all the toppings
  // don't need to query toppings because we are querying the pizzas and their toppings with map filter reduce - likely why "toppings" is underlined in yellow.
  const { toppings, pizzas } = useStaticQuery(graphql`
    query {
      toppings: allSanityTopping {
        nodes {
          name
          id
          vegetarian
        }
      }
      pizzas: allSanityPizza {
        nodes {
          toppings {
            name
            id
          }
        }
      }
    }
  `);
  console.clear();

  // get a list of all the Pizzas with their toppings
  // count how many pizzas are in each topping
  const toppingsWithCounts = countPizzasInToppings(pizzas.nodes);
  // console.log({ toppingsWithCounts });

  // loop over the list of toppings and display the topping and the count of pizzas in that topping
  // link it up...
  // don't need to add the "active" className, and it isn't used in the css above, because we're using aria-current='page' but Wes left it so I am also.
  return (
    <ToppingsStyles>
      <Link to="/pizzas">
        <span className="name">All</span>
        <span className="count">{pizzas.nodes.length}</span>
      </Link>
      {toppingsWithCounts.map((topping) => (
        <Link
          to={`/topping/${topping.name}`}
          key={topping.id}
          className={topping.name === activeTopping ? 'active' : ''}
        >
          <span className="name">{topping.name}</span>
          <span className="count">{topping.count}</span>
        </Link>
      ))}
    </ToppingsStyles>
  );
}
