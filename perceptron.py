"""
Perceptron - A software implementation of a physical perceptron machine.

The physical machine consists of:
- 16 input switches (in a 4x4 grid) that can be UP (1) or DOWN (-1)
- 16 weight knobs corresponding to each switch
- 1 bias knob
- A summing circuit that calculates: Output = Sum(Input_i * Weight_i) + Bias
"""


class Perceptron:
    """
    A perceptron that calculates the weighted sum of inputs plus bias.
    
    The perceptron simulates a physical machine with 16 switches and 16 weight knobs.
    Each switch can be UP (1) or DOWN (-1), and the output is the dot product
    of inputs and weights plus the bias term.
    """
    
    def __init__(self, weights=None, bias=0.0):
        """
        Initialize the Perceptron with weights and bias.
        
        Args:
            weights: List of 16 float values representing the weights.
                     Defaults to zeros if not provided.
            bias: Float value representing the bias term. Defaults to 0.0.
        """
        if weights is None:
            self.weights = [0.0] * 16
        else:
            if len(weights) != 16:
                raise ValueError("Weights must be a list of exactly 16 values")
            self.weights = list(weights)
        
        self.bias = float(bias)
    
    def calculate_output(self, inputs):
        """
        Calculate the output of the perceptron.
        
        Args:
            inputs: List of 16 integers, each being either 1 (UP) or -1 (DOWN).
        
        Returns:
            Float: The weighted sum of inputs plus bias.
        
        Raises:
            ValueError: If inputs does not contain exactly 16 elements.
        """
        if len(inputs) != 16:
            raise ValueError("Input must be a list of exactly 16 values")
        
        # Calculate dot product of inputs and weights, then add bias
        output = sum(inp * weight for inp, weight in zip(inputs, self.weights))
        output += self.bias
        
        return output


if __name__ == "__main__":
    # Demonstrate the perceptron with a sample pattern
    print("=" * 60)
    print("Perceptron Machine Simulation")
    print("=" * 60)
    
    # Create sample weights (some positive, some negative)
    # These weights could be tuned to recognize specific patterns
    sample_weights = [
        0.5, 0.5, 0.5, 0.5,    # Row 1
        0.2, 1.0, 1.0, 0.2,    # Row 2
        0.2, 1.0, 1.0, 0.2,    # Row 3
        0.2, 0.2, 0.2, 0.2     # Row 4
    ]
    sample_bias = -2.0
    
    # Create a perceptron instance
    perceptron = Perceptron(weights=sample_weights, bias=sample_bias)
    
    # Define a "T" shaped pattern (as mentioned in the problem)
    # 1 represents UP, -1 represents DOWN
    # Visual representation (1 = *, -1 = .)
    #   * * * *
    #   . * * .
    #   . * * .
    #   . . . .
    t_pattern = [
        1,  1,  1,  1,     # Row 1: all UP
        -1, 1,  1, -1,     # Row 2: middle UP
        -1, 1,  1, -1,     # Row 3: middle UP
        -1, -1, -1, -1     # Row 4: all DOWN
    ]
    
    print("\nInput Pattern (T shape):")
    print("  * * * *")
    print("  . * * .")
    print("  . * * .")
    print("  . . . .")
    print(f"\nInput values: {t_pattern}")
    print(f"Weights: {sample_weights}")
    print(f"Bias: {sample_bias}")
    
    # Calculate and display output
    output = perceptron.calculate_output(t_pattern)
    print(f"\nCalculated Output: {output:.2f}")
    
    # Try another pattern - all switches UP
    all_up = [1] * 16
    print("\n" + "-" * 60)
    print("\nInput Pattern (All UP):")
    print("  * * * *")
    print("  * * * *")
    print("  * * * *")
    print("  * * * *")
    output_all_up = perceptron.calculate_output(all_up)
    print(f"\nCalculated Output: {output_all_up:.2f}")
    
    # Try another pattern - all switches DOWN
    all_down = [-1] * 16
    print("\n" + "-" * 60)
    print("\nInput Pattern (All DOWN):")
    print("  . . . .")
    print("  . . . .")
    print("  . . . .")
    print("  . . . .")
    output_all_down = perceptron.calculate_output(all_down)
    print(f"\nCalculated Output: {output_all_down:.2f}")
    
    print("\n" + "=" * 60)
