import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Phone, Mail, MapPin, Calendar, MessageSquare } from "lucide-react";
import axios from 'axios';
import debounce from 'lodash/debounce';


interface UserFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    dateOfBirth: string;
    occupation: string;
    bio: string;
    newsletter: boolean;
    terms: boolean;
}

export const UserForm = () => {
    const [formData, setFormData] = useState<UserFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        dateOfBirth: "",
        occupation: "",
        bio: "",
        newsletter: false,
        terms: false,
    });
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<Partial<UserFormData>>({});

    const handleInputChange = (field: keyof UserFormData, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<UserFormData> = {};

        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
        if (!formData.terms) newErrors.terms = "You must accept the terms and conditions";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);

            // In a real app, you would send this to your API
            await axios.post('http://localhost:3000/submit', formData).then(response => {
                console.log('Form submitted successfully:', response.data);
                // Simulate API call
                // await new Promise(resolve => setTimeout(resolve, 1000));

                setSuccess(true);
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    address: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    dateOfBirth: "",
                    occupation: "",
                    bio: "",
                    newsletter: false,
                    terms: false,
                });

                // Reset success message after 3 seconds
                setTimeout(() => setSuccess(false), 3000);
            }).catch(error => {
                console.error('Error submitting form:', error);
                setSubmitError(error?.response?.data?.error || "Failed to submit form");
                setLoading(false);
            });

            console.log(`fetchComments`, formData);



        } catch (err) {
            console.error('Failed to submit form:', err);
        } finally {
            setLoading(false);
        }
    };

    const states = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
        "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
        "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
        "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
        "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
        "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
        "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
        "Wisconsin", "Wyoming"
    ];

    if (success) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <User className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-green-600 mb-2">Form Submitted Successfully!</h3>
                        <p className="text-muted-foreground">Thank you for your submission. We'll get back to you soon.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // const debouncedSubmit = useCallback(debounce(handleSubmit, 500), []);

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    User Information Form
                </CardTitle>
                <CardDescription>
                    Please fill out your information below. All fields marked with * are required.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {submitError && (
                    <div className="text-red-600 bg-red-100 border border-red-300 p-3 rounded mb-4">
                        {submitError}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Personal Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    placeholder="Enter your first name"
                                    className={errors.firstName ? "border-red-500" : ""}
                                />
                                {errors.firstName && (
                                    <p className="text-sm text-red-500">{errors.firstName}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name *</Label>
                                <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    placeholder="Enter your last name"
                                    className={errors.lastName ? "border-red-500" : ""}
                                />
                                {errors.lastName && (
                                    <p className="text-sm text-red-500">{errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="Enter your email"
                                        className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number *</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="Enter your phone number"
                                        className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="text-sm text-red-500">{errors.phone}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="dateOfBirth"
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="occupation">Occupation</Label>
                                <Input
                                    id="occupation"
                                    value={formData.occupation}
                                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                                    placeholder="Enter your occupation"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Address Information
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="address">Street Address *</Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                placeholder="Enter your street address"
                                className={errors.address ? "border-red-500" : ""}
                            />
                            {errors.address && (
                                <p className="text-sm text-red-500">{errors.address}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    placeholder="Enter your city"
                                    className={errors.city ? "border-red-500" : ""}
                                />
                                {errors.city && (
                                    <p className="text-sm text-red-500">{errors.city}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="state">State *</Label>
                                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                                    <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Select your state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {states.map((state) => (
                                            <SelectItem key={state} value={state}>
                                                {state}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.state && (
                                    <p className="text-sm text-red-500">{errors.state}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="zipCode">ZIP Code *</Label>
                                <Input
                                    id="zipCode"
                                    value={formData.zipCode}
                                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                    placeholder="Enter ZIP code"
                                    className={errors.zipCode ? "border-red-500" : ""}
                                />
                                {errors.zipCode && (
                                    <p className="text-sm text-red-500">{errors.zipCode}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Additional Information
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                placeholder="Tell us a little about yourself..."
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="newsletter"
                                checked={formData.newsletter}
                                onCheckedChange={(checked) => handleInputChange('newsletter', checked as boolean)}
                            />
                            <Label htmlFor="newsletter">Subscribe to our newsletter</Label>
                        </div>

                        <div className="flex items-start space-x-2">
                            <Checkbox
                                id="terms"
                                checked={formData.terms}
                                onCheckedChange={(checked) => handleInputChange('terms', checked as boolean)}
                                className="mt-1"
                            />
                            <div className="space-y-1">
                                <Label htmlFor="terms" className="text-sm">
                                    I agree to the terms and conditions *
                                </Label>
                                {errors.terms && (
                                    <p className="text-sm text-red-500">{errors.terms}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Form"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}; 