<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class GenerateUserToken extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:token {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate a Bearer token for a user by email';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("User with email {$email} not found.");
            // Ask if they want to create one
            if ($this->confirm('Do you want to create this user?', true)) {
                $name = $this->ask('Name', 'Test User');
                $password = $this->secret('Password (default: password)') ?: 'password';
                
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'password' => bcrypt($password),
                ]);
                $this->info('User created.');
            } else {
                return 1;
            }
        }

        $token = $user->createToken('manual-token')->plainTextToken;

        $this->info("Token for {$user->name} ({$user->email}):");
        $this->line($token);

        return 0;
    }
}
