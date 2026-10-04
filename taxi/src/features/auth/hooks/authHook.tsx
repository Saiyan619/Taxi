import { useMutation } from "@tanstack/react-query";
import { login, register, requestPasswordReset, resetPassword, verify } from "../api/authApi"
import { toast } from "@/components/ui/toast";
import axios from "axios";
import { useAuth } from "@/stores/authStore";
import { useNavigate } from "react-router";

const useAuthStore = useAuth.getState();

export const useRegister = () => {

    const { mutateAsync: registerUser, isPending, isError } = useMutation({
        mutationFn: register,
        onSuccess: () => {
            toast.add({
                type: "success",
                title: "Registration Successful",
                description: `Check your email for verification link`,
            });
        },
       onError: (error) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message ?? error.message;
    toast.add({
      type: "error",
      title: "Registration Failed",
      description: `Failed to register: ${message}`,
      priority: "high",
    });
  } else {
    toast.add({
      type: "error",
      title: "Registration Failed",
      description: "Something went wrong",
      priority: "high",
    });
  }
}
    })

    return { registerUser, isPending, isError };
}

export const useVerifyEmail = () => {
    const { mutateAsync: verifyEmail, isPending, isError } = useMutation({
        mutationFn: verify,
        onSuccess: () => {
            toast.add({
                type: "success",
                title: "Email Verified",
                description: `Your email has been verified. You can now log in.`,
            });
        },
         onError: (error) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message ?? error.message;
    toast.add({
      type: "error",
      title: "Verification Failed",
      description: `Failed to Verify: ${message}`,
      priority: "high",
    });
  } else {
    toast.add({
      type: "error",
      title: "Verification Failed",
      description: "Something went wrong",
      priority: "high",
    });
  }
}
    })

    return{verifyEmail, isPending, isError}
}

export const useLogin = () => {
  const navigate = useNavigate();
  // const setAccessToken = useAuth((s) => s.setAccessToken);
    const { mutateAsync: loginUser, isPending, isError, isSuccess } = useMutation({
        mutationFn: login,
        onSuccess: () => {
          useAuthStore.setAccessToken(data.token);
          useAuthStore.setIsAuthenticated(true);
            toast.add({
                type: "success",
                title: "Login Successful",
                description: `You have successfully logged in.`,
            });
            navigate("/home");
        },
         onError: (error) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message ?? error.message;
    toast.add({
      type: "error",
      title: "Login Failed",
      description: `Failed to Login: ${message}`,
      priority: "high",
    });
  } else {
    toast.add({
      type: "error",
      title: "Login Failed",
      description: "Something went wrong",
      priority: "high",
    });
  }
}
    })

    return{loginUser, isPending, isError, isSuccess}
}

export const useRequestPasswordReset = () => {
  // const setAccessToken = useAuth((s) => s.setAccessToken);
    const { mutateAsync: reqPasswordReset, isPending, isError, isSuccess } = useMutation({
        mutationFn: requestPasswordReset,
        onSuccess: () => {
        // setAccessToken(data.token);
            toast.add({
                type: "success",
                title: "Password Reset Requested",
                description: `Please check your email for further instructions.`,
            });
        },
         onError: (error) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message ?? error.message;
    toast.add({
      type: "error",
      title: "Password Reset Failed",
      description: `Failed to request password reset: ${message}`,
      priority: "high",
    });
  } else {
    toast.add({
      type: "error",
      title: "Password Reset Failed",
      description: "Something went wrong",
      priority: "high",
    });
  }
}
    })

    return{reqPasswordReset, isPending, isError, isSuccess}
}

export const usePasswordReset = () => {
  // const setAccessToken = useAuth((s) => s.setAccessToken);
    const { mutateAsync: passwordReset, isPending } = useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
        // setAccessToken(data.token);
            toast.add({
                type: "success",
                title: "Password Reset Successful",
                description: `Do well to make sure you don't forget next time!`,
            });
        },
         onError: (error) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message ?? error.message;
    toast.add({
      type: "error",
      title: "Password Reset Failed",
      description: `Failed to reset password: ${message}`,
      priority: "high",
    });
  } else {
    toast.add({
      type: "error",
      title: "Password Reset Failed",
      description: "Something went wrong",
      priority: "high",
    });
  }
}
    })

    return{passwordReset, isPending}
}