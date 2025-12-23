/**
 * Perceptron - A software implementation of a physical perceptron machine.
 * 
 * The physical machine consists of:
 * - 16 input switches (in a 4x4 grid) that can be UP (1) or DOWN (-1)
 * - 16 weight knobs corresponding to each switch
 * - 1 bias knob
 * - A summing circuit that calculates: Output = Sum(Input_i * Weight_i) + Bias
 */

class Perceptron {
    /**
     * Initialize the Perceptron with weights and bias.
     * 
     * @param {number[]} weights - Array of 16 float values representing the weights.
     *                             Defaults to zeros if not provided.
     * @param {number} bias - Float value representing the bias term. Defaults to 0.0.
     */
    constructor(weights = null, bias = 0.0) {
        if (weights === null) {
            this.weights = new Array(16).fill(0.0);
        } else {
            if (weights.length !== 16) {
                throw new Error("Weights must be an array of exactly 16 values");
            }
            this.weights = [...weights];
        }
        
        this.bias = Number(bias);
    }
    
    /**
     * Calculate the output of the perceptron.
     * 
     * @param {number[]} inputs - Array of 16 integers, each being either 1 (UP) or -1 (DOWN).
     * @returns {number} The weighted sum of inputs plus bias.
     * @throws {Error} If inputs does not contain exactly 16 elements.
     */
    calculateOutput(inputs) {
        if (inputs.length !== 16) {
            throw new Error("Input must be an array of exactly 16 values");
        }
        
        // Calculate dot product of inputs and weights, then add bias
        let output = 0;
        for (let i = 0; i < 16; i++) {
            output += inputs[i] * this.weights[i];
        }
        output += this.bias;
        
        return output;
    }
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Perceptron;
}

// Sample usage demonstration
if (typeof require !== 'undefined' && require.main === module) {
    console.log("=".repeat(60));
    console.log("Perceptron Machine Simulation");
    console.log("=".repeat(60));
    
    // Create sample weights (some positive, some negative)
    // These weights could be tuned to recognize specific patterns
    const sampleWeights = [
        0.5, 0.5, 0.5, 0.5,    // Row 1
        0.2, 1.0, 1.0, 0.2,    // Row 2
        0.2, 1.0, 1.0, 0.2,    // Row 3
        0.2, 0.2, 0.2, 0.2     // Row 4
    ];
    const sampleBias = -2.0;
    
    // Create a perceptron instance
    const perceptron = new Perceptron(sampleWeights, sampleBias);
    
    // Define a "T" shaped pattern (as mentioned in the problem)
    // 1 represents UP, -1 represents DOWN
    // Visual representation (1 = *, -1 = .)
    //   * * * *
    //   . * * .
    //   . * * .
    //   . . . .
    const tPattern = [
        1,  1,  1,  1,     // Row 1: all UP
        -1, 1,  1, -1,     // Row 2: middle UP
        -1, 1,  1, -1,     // Row 3: middle UP
        -1, -1, -1, -1     // Row 4: all DOWN
    ];
    
    console.log("\nInput Pattern (T shape):");
    console.log("  * * * *");
    console.log("  . * * .");
    console.log("  . * * .");
    console.log("  . . . .");
    console.log(`\nInput values: [${tPattern.join(", ")}]`);
    console.log(`Weights: [${sampleWeights.join(", ")}]`);
    console.log(`Bias: ${sampleBias}`);
    
    // Calculate and display output
    const output = perceptron.calculateOutput(tPattern);
    console.log(`\nCalculated Output: ${output.toFixed(2)}`);
    
    // Try another pattern - all switches UP
    const allUp = new Array(16).fill(1);
    console.log("\n" + "-".repeat(60));
    console.log("\nInput Pattern (All UP):");
    console.log("  * * * *");
    console.log("  * * * *");
    console.log("  * * * *");
    console.log("  * * * *");
    const outputAllUp = perceptron.calculateOutput(allUp);
    console.log(`\nCalculated Output: ${outputAllUp.toFixed(2)}`);
    
    // Try another pattern - all switches DOWN
    const allDown = new Array(16).fill(-1);
    console.log("\n" + "-".repeat(60));
    console.log("\nInput Pattern (All DOWN):");
    console.log("  . . . .");
    console.log("  . . . .");
    console.log("  . . . .");
    console.log("  . . . .");
    const outputAllDown = perceptron.calculateOutput(allDown);
    console.log(`\nCalculated Output: ${outputAllDown.toFixed(2)}`);
    
    console.log("\n" + "=".repeat(60));
}
