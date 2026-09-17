import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from './pages/register';

test('blocks registration when password and confirm password do not match', async () => {
  const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true,
    json: async () => ({ success: true, message: 'User created' })
  });

  render(<Register />);

  await userEvent.type(screen.getByLabelText(/username/i), 'Alice');
  await userEvent.type(screen.getByLabelText(/email/i), 'alice@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'secret123');
  await userEvent.type(screen.getByLabelText(/confirm/i), 'different');
  await userEvent.click(screen.getByRole('button', { name: /register/i }));

  expect(fetchSpy).not.toHaveBeenCalled();
  expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();

  fetchSpy.mockRestore();
});
