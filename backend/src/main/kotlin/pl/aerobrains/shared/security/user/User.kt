package pl.aerobrains.shared.security.user

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.SequenceGenerator
import jakarta.persistence.Table
import pl.aerobrains.shared.persistence.BaseEntity
import pl.aerobrains.shared.security.UserRole

@Entity
@Table(name = "users")
@SequenceGenerator(name = "default_seq", sequenceName = "USERS_SEQ", allocationSize = 1)
class User(
    @Column(name = "first_name", nullable = false, length = 100)
    var firstName: String,

    @Column(name = "last_name", nullable = false, length = 100)
    var lastName: String,

    @Column(nullable = false, unique = true, length = 100)
    var email: String,

    @Column(nullable = false, length = 255)
    var password: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    var role: UserRole
) : BaseEntity()