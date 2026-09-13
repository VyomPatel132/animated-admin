import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "../components/core/Logo";
import { LoadingButton } from "../components/ui/loading-button";
import { useAppDispatch } from "../hooks/useStore";
import { signIn } from "../store/slices/authSlice";
const schema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Use at least 6 characters for this demo."),
});
export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "alex@aperture.co", password: "aperture-demo" },
  });
  async function login(v: z.infer<typeof schema>) {
    await new Promise((r) => setTimeout(r, 500));
    dispatch(signIn(v.email));
    navigate("/dashboard");
  }
  return (
    <div className="login-page">
      <div className="login-art">
        <Logo />
        <div className="login-art-copy">
          <span className="eyebrow">A CLEARER VIEW. A BIGGER PICTURE.</span>
          <h1>
            Your business.
            <br />
            In a whole
            <br />
            <em>new light.</em>
          </h1>
          <p>
            A little clarity changes everything.
            <br />
            Welcome to your next chapter.
          </p>
        </div>
        <div className="orbital-art">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, ease: "linear", repeat: Infinity }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} style={{ transform: `rotate(${i * 36}deg)` }} />
            ))}
          </motion.div>
        </div>
        <small>© 2026 Aperture</small>
      </div>
      <div className="login-form-wrap">
        <motion.div
          className="login-form"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="eyebrow">GOOD TO SEE YOU AGAIN</span>
          <h1>Welcome back.</h1>
          <p>Let’s pick up where you left off.</p>
          <form className="form-stack" onSubmit={handleSubmit(login)}>
            <label>
              Email address
              <input {...register("email")} autoComplete="email" />
              {errors.email && (
                <span className="form-error">{errors.email.message}</span>
              )}
            </label>
            <label>
              Password
              <input
                {...register("password")}
                type="password"
                autoComplete="current-password"
              />
              {errors.password && (
                <span className="form-error">{errors.password.message}</span>
              )}
            </label>
            <LoadingButton loading={isSubmitting}>
              Enter your workspace <ArrowRight size={16} />
            </LoadingButton>
          </form>
          <div className="demo-note">
            <ShieldCheck size={17} />
            <p>
              This is an interactive demo. Use the prefilled details or any
              valid email and a 6-character password.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
