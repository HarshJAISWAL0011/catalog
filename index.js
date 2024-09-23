const fs = require('fs');
const path = require('path');
const express = require('express');

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


// Main function to load and process the JSON file
function main() {
    const inputFilePath = path.join(__dirname, 'input.json');
    const rawData = fs.readFileSync(inputFilePath);
    const data = JSON.parse(rawData);

    const n = data.keys.n;
    const k = data.keys.k;

    const points = extractPoints(data, n);
    const constantTermC = findConstantTerm(points.slice(0, k)); // Use the first 'k' points

    console.log('The constant term c is:', constantTermC);
}

// Function to extract points (x, y) from the JSON data
function extractPoints(data, n) {
    const points = [];
    for (let i = 1; i <= n; i++) {
        const pointData = data[i.toString()];
        if (pointData) {
            const base = pointData.base;
            const value = pointData.value;
            const decodedY = decodeValue(base, value);
            points.push(new Point(i, decodedY));
        }
    }
    return points;
}

// Function to decode the 'y' value based on the given base
function decodeValue(base, value) {
    return parseInt(value, base); // Decode the value using the base
}

// Function to apply Lagrange Interpolation and find the constant term 'c'
function findConstantTerm(points) {
    let c = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
        const xi = points[i].x;
        const yi = points[i].y;
        let li = 1;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                const xj = points[j].x;
                li *= (0 - xj) / (xi - xj); // li(0) = product of (0 - xj) / (xi - xj)
            }
        }

        c += yi * li; // Add the term yi * li to the constant term
    }

    return Math.round(c); // Return the constant term
}

main(); // Run the main function after the server starts