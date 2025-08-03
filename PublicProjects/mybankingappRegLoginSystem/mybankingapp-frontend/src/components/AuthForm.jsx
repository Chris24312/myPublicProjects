import Input from './Input';

const AuthForm = ({ title, onSubmit, values, onChange, buttonText }) => (
  <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 py-6 max-w-md mx-auto mt-20">
    <h2 className="text-2xl font-semibold text-center mb-6">{title}</h2>

    <Input label="Email" type="email" name="email" value={values.email} onChange={onChange} placeholder="you@example.com" />
    <Input label="Password" type="password" name="password" value={values.password} onChange={onChange} placeholder="••••••••" />

    {values.name !== undefined && (
      <Input label="Name" type="text" name="name" value={values.name} onChange={onChange} placeholder="Your Name" />
    )}

    <button
      type="submit"
      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
    >
      {buttonText}
    </button>
  </form>
);

export default AuthForm;
