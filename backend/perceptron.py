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
    
    def set_weights(self, weights):
        """
        Set new weight values.
        
        Args:
            weights: List of 16 float values.
        
        Raises:
            ValueError: If weights does not contain exactly 16 elements.
        """
        if len(weights) != 16:
            raise ValueError("Weights must be a list of exactly 16 values")
        self.weights = list(weights)
    
    def set_bias(self, bias):
        """
        Set new bias value.
        
        Args:
            bias: Float value for the bias term.
        """
        self.bias = float(bias)
    
    def get_weights(self):
        """
        Get current weight values.
        
        Returns:
            List of 16 float values representing the current weights.
        """
        return self.weights.copy()
    
    def get_bias(self):
        """
        Get current bias value.
        
        Returns:
            Float value of the current bias.
        """
        return self.bias
