import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Label } from "@/components/ui/label";
import { LanguageToggle } from "@/components/LanguageToggle";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye, EyeOff, Mail, Lock, User, Heart } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Signup() {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const isSpanish = i18n.language === "es";

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert(isSpanish ? "Las contraseñas no coinciden" : "Passwords do not match");
            return;
        }

        console.log({ name, email, password, confirmPassword });
        navigate("/");
    };

    return (
        <div className="flex min-h-screen bg-background transition-all duration-300">
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-90 transition-colors duration-300"></div>
                <div className="absolute inset-0 bg-[url('/mesh-pattern.svg')] opacity-10"></div>
                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
                    <div className="flex items-center gap-3 mb-8">
                        <Heart className="h-12 w-12" />
                        <h1 className="text-5xl font-bold">wellpedia.ai</h1>
                    </div>
                    <p className="text-xl mb-8 text-center max-w-md opacity-90">
                        {isSpanish
                            ? "Únete a wellpedia.ai y comienza a gestionar el bienestar de tu equipo"
                            : "Join wellpedia.ai and start managing your team's wellness"}
                    </p>
                    <div className="grid grid-cols-1 gap-4 mt-8 max-w-lg">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <p className="text-sm opacity-80 mb-2">
                                {isSpanish ? "✓ Evaluaciones NOM-035" : "✓ NOM-035 Assessments"}
                            </p>
                            <p className="text-sm opacity-80 mb-2">
                                {isSpanish ? "✓ Reportes instantáneos" : "✓ Instant reports"}
                            </p>
                            <p className="text-sm opacity-80 mb-2">
                                {isSpanish ? "✓ Seguimiento histórico" : "✓ Historical tracking"}
                            </p>
                            <p className="text-sm opacity-80">
                                {isSpanish ? "✓ 100% Confidencial" : "✓ 100% Confidential"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full lg:w-1/2 p-8 bg-background transition-all duration-300">
                <header className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-2">
                        <Heart className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold">wellpedia.ai</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div>
                                        <LanguageToggle />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isSpanish ? "Cambiar idioma" : "Change language"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div>
                                        <ModeToggle />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{isSpanish ? "Cambiar tema" : "Toggle theme"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </header>

                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                    <Card className="border-2 border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                {isSpanish ? "Crea tu cuenta" : "Create your account"}
                            </CardTitle>
                            <CardDescription>
                                {isSpanish
                                    ? "Regístrate para acceder a tu panel"
                                    : "Sign up to access your dashboard"}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium">
                                        {isSpanish ? "Nombre completo" : "Full name"}
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder={isSpanish ? "Tu nombre" : "Your name"}
                                            className="pl-10"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        {isSpanish ? "Correo electrónico" : "Email address"}
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder={isSpanish ? "tu@ejemplo.com" : "you@example.com"}
                                            className="pl-10"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        {isSpanish ? "Contraseña" : "Password"}
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder={isSpanish ? "Crea una contraseña" : "Create a password"}
                                            className="pl-10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1 h-8 w-8 text-muted-foreground"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                            <span className="sr-only">
                                                {showPassword
                                                    ? isSpanish ? "Ocultar contraseña" : "Hide password"
                                                    : isSpanish ? "Mostrar contraseña" : "Show password"}
                                            </span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password" className="text-sm font-medium">
                                        {isSpanish ? "Confirmar contraseña" : "Confirm password"}
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="confirm-password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder={isSpanish ? "Confirma tu contraseña" : "Re-enter your password"}
                                            className="pl-10"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1 h-8 w-8 text-muted-foreground"
                                            onClick={toggleConfirmPasswordVisibility}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                            <span className="sr-only">
                                                {showConfirmPassword
                                                    ? isSpanish ? "Ocultar contraseña" : "Hide password"
                                                    : isSpanish ? "Mostrar contraseña" : "Show password"}
                                            </span>
                                        </Button>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                                    {isSpanish ? "Crear cuenta" : "Create account"}
                                </Button>
                            </form>
                        </CardContent>

                        <CardFooter className="flex justify-center">
                            <p className="text-sm text-muted-foreground">
                                {isSpanish ? "¿Ya tienes una cuenta? " : "Already have an account? "}
                                <NavLink to="/login" className="text-primary hover:underline font-medium">
                                    {isSpanish ? "Iniciar sesión" : "Sign in"}
                                </NavLink>
                            </p>
                        </CardFooter>
                    </Card>

                    <p className="text-center text-xs text-muted-foreground mt-6">
                        {isSpanish
                            ? "Al crear una cuenta, aceptas nuestros Términos de Servicio y Política de Privacidad"
                            : "By creating an account, you agree to our Terms of Service and Privacy Policy"}
                    </p>
                </div>
            </div>
        </div>
    );
}
