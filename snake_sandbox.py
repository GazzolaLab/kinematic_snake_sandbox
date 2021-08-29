from kinematic_snake_core import run_snake, KinematicSnake, LiftingKinematicSnake
import numpy as np
from scipy.interpolate import interp1d
from scipy.integrate import trapz


class SandboxInterface:
    """
    An interface to the snake for the online sandbox
    """

    def __init__(self, snake: KinematicSnake, sol_history, total_n_points: int):
        self.snake = snake

        total_time = sol_history.t[-1]
        self.plot_times = np.linspace(0.0, total_time, total_n_points + 1)

        state_interpolant = interp1d(sol_history.t, sol_history.y)

        self.interpolated_mesh = state_interpolant(self.plot_times)

    # instead of __call__ use call()
    def call(self, index):
        solution = self.interpolated_mesh[:, index]
        self.snake.state = solution.reshape(-1, 1)
        self.snake._construct(self.time(index))

        return self.snake.x_s[0, ...], self.snake.x_s[1, ...]

    def com(self, index):
        solution = self.interpolated_mesh[:, index].reshape(-1, 1)
        return solution[0], solution[1]

    def time(self, index):
        return self.plot_times[index]


def _simulate_snake(final_time: float, n_points_in_time: int, **kwargs):
    snake, sol_history, time_period = run_snake(
        froude=float(kwargs.pop('froude')),
        time_interval=[0.0, final_time],
        snake_type=LiftingKinematicSnake,
        **kwargs
    )
    # print(sol_history.y.shape)
    # print(sol_history.t.shape)
    # print(sol_history.t[0], sol_history.t[1], sol_history.t[-1])
    return SandboxInterface(snake, sol_history, n_points_in_time)


def simulate_snake_with_sin_sin_lift(
    final_time: float, n_points_in_time: int, snake_params
):
    return _simulate_snake(final_time, n_points_in_time, **snake_params)


def simulate_snake_with_sin_no_lift(
    final_time: float, n_points_in_time: int, snake_params
):
    # snake_params.update('lifting_activation', lambda s, t: 1.0)
    snake_params['lift_amp'] = 0.0
    snake_params['lift_wave_number'] = 2.0  # doesnt matter
    return _simulate_snake(final_time, n_points_in_time, **snake_params)


def simulate_snake_with_sin_exp_lift(
    final_time: float, n_points_in_time: int, snake_params
):
    epsilon = snake_params['epsilon']
    wave_number = snake_params['wave_number']
    a_value = snake_params.get('lift_a_value', 0.02)
    print(a_value)

    def my_custom_lifting_activation(s, time_v):
        if time_v > 2.0:
            lateral_wave = epsilon * np.cos(wave_number * np.pi * (s + time_v))
            liftwave = np.exp(-(a_value ** 2) * lateral_wave ** 2)
            np.maximum(0, liftwave, out=liftwave)
            return liftwave / trapz(liftwave, s)
        else:
            return 1.0 + 0.0 * s

    snake_params['lifting_activation'] = my_custom_lifting_activation
    return _simulate_snake(final_time, n_points_in_time, **snake_params)
